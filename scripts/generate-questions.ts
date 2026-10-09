#!/usr/bin/env node
/**
 * generate-questions.ts
 *
 * Utilitario CLI local para geracao em micro-lotes de questoes de concurso
 * utilizando a API do Google Gemini (Structured Outputs) e persistencia direta
 * no banco de dados SQLite local com transacoes atomicas e anti-duplicacao.
 */

import 'dotenv/config';
import { parseArgs } from 'node:util';
import { FCC_TCE_SYSTEM_PROMPT, buildBatchPrompt } from './prompts/system-fcc-tce';
import { generateQuestionBatch } from './gemini-client';
import { buildCavemanExclusionList } from './caveman-compressor';
import { loadKnowledgeForTopic } from './knowledge-loader';
import {
  getOrCreateCategory,
  getQuestionsCount,
  getExistingStatements,
  insertQuestionBatchTransaction,
  closeDb,
} from './db-service';

// Utilitario de sleep assincrono com contagem regressiva
async function sleepWithNotice(ms: number) {
  const seconds = Math.ceil(ms / 1000);
  process.stdout.write(`[PAUSA] Aguardando rate limit (${seconds}s): `);
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(`${i}.. `);
    await new Promise(r => setTimeout(r, 1000));
  }
  process.stdout.write('Pronto!\n');
}

async function main() {
  console.log('\n======================================================');
  console.log('CardsConcurso - Gerador & Ingestor CLI de Questoes');
  console.log('Banca: FCC | Concurso Alvo: TCE-GO | Engine: Gemini');
  console.log('======================================================\n');

  // 1. Interpretar argumentos de linha de comando
  const options = {
    topic: { type: 'string' as const, short: 't' },
    target: { type: 'string' as const },
    delay: { type: 'string' as const, short: 'd' },
    batchSize: { type: 'string' as const, short: 'b' },
    help: { type: 'boolean' as const, short: 'h' },
  };

  let parsedArgs;
  try {
    parsedArgs = parseArgs({
      options,
      allowPositionals: true,
      strict: false,
    });
  } catch (err: any) {
    console.error(`[ERRO] Argumentos CLI invalidos: ${err.message}`);
    process.exit(1);
  }

  if (parsedArgs.values.help) {
    console.log(`Uso:
  npm run generate-questions -- --topic "<Nome do Topico>" [opcoes]

Opcoes:
  --topic, -t       (Obrigatorio) Nome do topico / disciplina (ex: "Controle Externo")
  --target          Meta total de questoes para o topico (padrao: do .env ou 120)
  --delay, -d       Intervalo de pausa entre lotes em ms (padrao: do .env ou 4000)
  --batchSize, -b   Quantidade de questoes por lote (padrao: do .env ou 5)
  --help, -h        Exibe esta mensagem de ajuda
`);
    process.exit(0);
  }

  // Obter topico
  const topic = parsedArgs.values.topic || parsedArgs.positionals[0];
  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    console.error('[ERRO] E obrigatorio informar o topico com --topic "<Nome>"');
    console.error('Exemplo: npm run generate-questions -- --topic "Controle Externo - TCE-GO"\n');
    process.exit(1);
  }

  const cleanTopic = topic.trim();

  // Valores padrao com fallback do .env
  const targetTotal = Number(parsedArgs.values.target || process.env.DEFAULT_TARGET_QUESTIONS || 120);
  const delayMs = Number(parsedArgs.values.delay || process.env.BATCH_DELAY_MS || 4000);
  const batchSize = Number(parsedArgs.values.batchSize || process.env.BATCH_SIZE || 5);
  const maxRetries = Number(process.env.MAX_RETRIES || 3);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  console.log(`[CONFIGURACAO OPERACIONAL]`);
  console.log(`   - Topico:           "${cleanTopic}"`);
  console.log(`   - Meta de Questoes: ${targetTotal}`);
  console.log(`   - Tamanho do Lote:  ${batchSize}`);
  console.log(`   - Delay de Lote:    ${delayMs}ms (${delayMs / 1000}s)`);
  console.log(`   - Modelo Gemini:    ${modelName}\n`);

  // 2. Conectar ao SQLite e obter estado inicial
  const categoryId = getOrCreateCategory(cleanTopic);
  let currentCount = getQuestionsCount(categoryId);
  console.log(`[STATUS BANCO] Categoria ID #${categoryId} possui ${currentCount} questoes.`);

  if (currentCount >= targetTotal) {
    console.log(`\n[AVISO] Meta ja alcancada ou ultrapassada! (${currentCount}/${targetTotal} questoes cadastradas).`);
    console.log('Nenhuma geracao adicional necessaria. Finalizando.\n');
    closeDb();
    process.exit(0);
  }

  // 3. Prevencao de duplicatas (Carregar enunciados e preparar Caveman cache)
  const existingStatements = getExistingStatements(categoryId);
  console.log(`[CACHE] Enunciados previos carregados na memoria: ${existingStatements.length}`);

  // 4. Carregar referencias do edital / provas (Grounding)
  console.log(`[GROUNDING] Buscando material de ancoragem (edital/provas) para o topico...`);
  const knowledge = loadKnowledgeForTopic(cleanTopic);
  if (knowledge.editalSummary) {
    console.log(`   [OK] Trecho relevante do edital anexado com sucesso.`);
  }
  if (knowledge.sampleQuestions) {
    console.log(`   [OK] Questao de referencia de estilo carregada.`);
  }

  const startTime = Date.now();
  let batchIndex = 0;
  const initialCount = currentCount;

  // 5. Loop de Micro-Lotes
  while (currentCount < targetTotal) {
    batchIndex++;
    const remaining = targetTotal - currentCount;
    const currentBatchSize = Math.min(batchSize, remaining);

    console.log(`\n------------------------------------------------------`);
    console.log(`[LOTE ${batchIndex}] Gerando ${currentBatchSize} questoes... (Progresso: ${currentCount}/${targetTotal})`);

    // Comprimir enunciados existentes com algoritmo Caveman para economizar tokens
    const cavemanExclusionList = buildCavemanExclusionList(existingStatements);

    // Montar prompt com as fontes e exclusoes
    const userPrompt = buildBatchPrompt({
      topic: cleanTopic,
      batchSize: currentBatchSize,
      cavemanExclusionList,
      editalContext: knowledge.editalSummary,
      sampleQuestion: knowledge.sampleQuestions,
    });

    try {
      // Chamar API com Structured Outputs e validacao estrita
      const generatedQuestions = await generateQuestionBatch(
        FCC_TCE_SYSTEM_PROMPT,
        userPrompt,
        currentBatchSize,
        maxRetries
      );

      console.log(`[VALIDACAO] Lote gerado e aprovado com sucesso!`);

      // Inserir transacionalmente no SQLite (Atomic Transaction)
      const insertResult = insertQuestionBatchTransaction(categoryId, generatedQuestions);
      console.log(`[COMMIT] Gravadas ${insertResult.insertedQuestions} questoes e ${insertResult.insertedOptions} alternativas no SQLite.`);

      // Atualizar cache de exclusao em memoria
      for (const q of generatedQuestions) {
        existingStatements.push(q.statement);
      }

      currentCount += insertResult.insertedQuestions;
      const percent = ((currentCount / targetTotal) * 100).toFixed(1);
      console.log(`[PROGRESSO] ${currentCount}/${targetTotal} questoes (${percent}%)`);

      // Se ainda nao atingiu a meta, aguarda o intervalo de rate limit
      if (currentCount < targetTotal) {
        await sleepWithNotice(delayMs);
      }
    } catch (batchError: any) {
      console.error(`\n[ERRO CRITICO] Falha no lote ${batchIndex}: ${batchError.message}`);
      console.error('O lote foi descartado para preservar a integridade do banco de dados.');
      console.log('Reiniciando tentativa apos pausa de seguranca...');
      await sleepWithNotice(delayMs * 1.5);
    }
  }

  const totalTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalAdded = currentCount - initialCount;

  console.log('\n======================================================');
  console.log('GERACAO E INGESTAO CONCLUIDAS COM SUCESSO');
  console.log(`   - Topico:             "${cleanTopic}"`);
  console.log(`   - Questoes Inseridas: +${totalAdded}`);
  console.log(`   - Total no Banco:     ${currentCount} questoes`);
  console.log(`   - Tempo Total:        ${totalTimeSeconds}s`);
  console.log('======================================================\n');

  closeDb();
  process.exit(0);
}

main().catch(err => {
  console.error('\n[ERRO FATAL] Erro nao tratado:', err);
  closeDb();
  process.exit(1);
});
