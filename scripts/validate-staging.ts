#!/usr/bin/env node
/**
 * validate-staging.ts
 *
 * Utilitário CLI para validação, diagnóstico sintático e semântico,
 * auto-reparo de anomalias comuns de LLM (como aspas não escapadas em citações)
 * e ingestão opcional de questões no banco de dados SQLite (CardsConcurso).
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'node:util';
import db, {
  getOrCreateCategory,
  findCategoryId,
  getQuestionsCount,
  getExistingStatements,
  insertQuestionBatchTransaction,
  closeDb,
} from './db-service';
import type { GeneratedQuestion, GeneratedOption } from './gemini-client';

// Cores ANSI para saída rica no terminal
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Função de auto-reparo de JSON gerado por LLMs em chats web
 */
export function repairJsonString(raw: string): { repaired: string; changes: string[] } {
  const changes: string[] = [];
  let content = raw.trim();

  // 1. Remover markdown code fences (```json ... ``` ou ``` ... ```)
  if (content.startsWith('```json')) {
    content = content.replace(/^```json\s*/i, '');
    changes.push('Removido bloco de abertura markdown ```json');
  } else if (content.startsWith('```')) {
    content = content.replace(/^```\s*/, '');
    changes.push('Removido bloco de abertura markdown ```');
  }

  if (content.endsWith('```')) {
    content = content.replace(/```\s*$/, '');
    changes.push('Removido bloco de fechamento markdown ```');
  }
  content = content.trim();

  // 2. Processar linha por linha para escapar aspas internas em propriedades de texto
  const lines = content.split(/\r?\n/);
  const repairedLines: string[] = [];
  let fixedQuoteCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detecta padrão de chave de string JSON: ex: "statement": " ... ou "text": " ...
    const keyMatch = line.match(/^(\s*"[a-zA-Z0-9_]+"\s*:\s*")/);
    if (!keyMatch) {
      repairedLines.push(line);
      continue;
    }

    const prefix = keyMatch[1];
    const rest = line.slice(prefix.length);

    // Detecta o fechamento da string na linha: termina com ", ou com "
    const suffixMatch = rest.match(/("(\s*,?\s*))$/);
    if (!suffixMatch) {
      repairedLines.push(line);
      continue;
    }

    const suffix = suffixMatch[1];
    const innerContent = rest.slice(0, rest.length - suffix.length);

    // Se o conteúdo interno contém aspas duplas, verifica quais não estão escapadas
    let repairedInner = '';
    let lineQuotesFixed = 0;

    for (let j = 0; j < innerContent.length; j++) {
      const char = innerContent[j];
      if (char === '"') {
        // Contar barras invertidas anteriores para saber se já estava escapado
        let backslashCount = 0;
        let k = j - 1;
        while (k >= 0 && innerContent[k] === '\\') {
          backslashCount++;
          k--;
        }
        // Se número par de barras (ou zero), a aspa NÃO está escapada
        if (backslashCount % 2 === 0) {
          repairedInner += '\\"';
          lineQuotesFixed++;
        } else {
          repairedInner += char;
        }
      } else {
        repairedInner += char;
      }
    }

    if (lineQuotesFixed > 0) {
      fixedQuoteCount += lineQuotesFixed;
    }

    repairedLines.push(prefix + repairedInner + suffix);
  }

  if (fixedQuoteCount > 0) {
    changes.push(`Escapadas ${fixedQuoteCount} aspas duplas internas de citações/assertivas`);
  }

  let result = repairedLines.join('\n');

  // 3. Remover trailing commas antes de fechamento de objeto ou array (ex: ", }" ou ", ]")
  const trailingCommaCount = (result.match(/,\s*([}\]])/g) || []).length;
  if (trailingCommaCount > 0) {
    result = result.replace(/,\s*([}\]])/g, '$1');
    changes.push(`Removidas ${trailingCommaCount} vírgulas sobressalentes (trailing commas)`);
  }

  return { repaired: result, changes };
}

/**
export interface ExtractedPayload {
  questions: any[];
  globalTopic?: string;
}

/**
 * Extrai o lote de questões e tópico global suportando:
 * 1. Array simples: [ { statement, ... } ]
 * 2. Envelope de objeto: { topic: "...", questions: [ ... ] }
 * 3. Campos alternativos: category, materia, disciplina / questoes, items, itens
 */
export function extractPayload(data: any): ExtractedPayload {
  if (Array.isArray(data)) {
    return { questions: data };
  }

  if (data && typeof data === 'object') {
    const list = data.questions || data.questoes || data.items || data.itens;
    const topic = data.topic || data.category || data.materia || data.disciplina;
    if (Array.isArray(list)) {
      return {
        questions: list,
        globalTopic: typeof topic === 'string' && topic.trim().length > 0 ? topic.trim() : undefined,
      };
    }
  }

  return { questions: [] };
}

/**
 * Validador estrito de regras de negócio das questões FCC / TCE-GO
 */
export function validateQuestionSchema(input: any): {
  valid: boolean;
  errors: string[];
  extractedQuestions: any[];
  globalTopic?: string;
} {
  const errors: string[] = [];
  const { questions, globalTopic } = extractPayload(input);

  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      valid: false,
      errors: [
        'O conteúdo deve ser um array JSON de questões (`[...]`) ou um objeto envelope (ex: `{ "topic": "Nome", "questions": [...] }`).',
      ],
      extractedQuestions: [],
      globalTopic,
    };
  }

  questions.forEach((q, qIndex) => {
    const qNum = qIndex + 1;

    // Enunciado
    if (!q.statement || typeof q.statement !== 'string' || q.statement.trim().length < 15) {
      errors.push(`Questão #${qNum}: Enunciado ausente ou muito curto (mínimo 15 caracteres).`);
    }

    // Dificuldade
    const diff = Number(q.difficulty);
    if (isNaN(diff) || !Number.isInteger(diff) || diff < 1 || diff > 10) {
      errors.push(`Questão #${qNum}: Dificuldade inválida (${q.difficulty}). Esperado número inteiro entre 1 e 10.`);
    }

    // Alternativas
    if (!Array.isArray(q.options)) {
      errors.push(`Questão #${qNum}: Campo 'options' deve ser um array com 5 alternativas.`);
      return;
    }

    if (q.options.length !== 5) {
      errors.push(`Questão #${qNum}: Possui ${q.options.length} alternativas (exige exatamente 5: A, B, C, D, E).`);
    }

    const correctOptions = q.options.filter((opt: any) => opt && opt.is_correct === true);
    if (correctOptions.length !== 1) {
      errors.push(
        `Questão #${qNum}: Possui ${correctOptions.length} alternativas corretas marcadas (deve ter estritamente 1 gabarito).`
      );
    }

    q.options.forEach((opt: any, optIndex: number) => {
      const letra = OPTION_LETTERS[optIndex] || `#${optIndex + 1}`;
      if (!opt || typeof opt !== 'object') {
        errors.push(`Questão #${qNum}, Alternativa ${letra}: Objeto de alternativa inválido.`);
        return;
      }

      if (!opt.text || typeof opt.text !== 'string' || opt.text.trim().length === 0) {
        errors.push(`Questão #${qNum}, Alternativa ${letra}: Texto da assertiva vazio.`);
      }

      if (typeof opt.is_correct !== 'boolean') {
        errors.push(`Questão #${qNum}, Alternativa ${letra}: 'is_correct' deve ser booleano (true ou false).`);
      }

      if (!opt.justification || typeof opt.justification !== 'string' || opt.justification.trim().length === 0) {
        errors.push(`Questão #${qNum}, Alternativa ${letra}: Justificativa técnica ausente ou vazia.`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    extractedQuestions: questions,
    globalTopic,
  };
}

/**
 * Exibe extrato de diagnóstico de erro de sintaxe com contexto de linha
 */
function displaySyntaxContext(rawContent: string, err: any) {
  console.log(`\n${c.red}${c.bold}[ERRO DE SINTAXE JSON NATIVO]${c.reset}`);
  console.log(`${c.red}Mensagem:${c.reset} ${err.message}`);

  // Tenta extrair a linha/coluna ou posição do erro
  const matchPos = err.message.match(/position (\d+)/i);
  if (matchPos) {
    const pos = parseInt(matchPos[1], 10);
    const upToErr = rawContent.slice(0, pos);
    const lineNum = upToErr.split('\n').length;
    const lines = rawContent.split('\n');

    console.log(`${c.yellow}Local aproximado:${c.reset} Linha ${lineNum}`);
    console.log(`${c.dim}----------------------------------------${c.reset}`);
    const startL = Math.max(0, lineNum - 3);
    const endL = Math.min(lines.length - 1, lineNum + 2);
    for (let l = startL; l <= endL; l++) {
      const isTarget = l === lineNum - 1;
      const marker = isTarget ? `${c.red}>${c.reset}` : ' ';
      const lineText = lines[l].length > 120 ? lines[l].slice(0, 117) + '...' : lines[l];
      console.log(`${marker} ${c.dim}${String(l + 1).padStart(4)} |${c.reset} ${lineText}`);
    }
    console.log(`${c.dim}----------------------------------------${c.reset}\n`);
  }
}

/**
 * Busca categoria no SQLite por ID ou por aproximação de nome
 */
function resolveCategory(topicInput?: string): { id: number; name: string } | null {
  const allCategories = db.prepare('SELECT id, name FROM categories ORDER BY id ASC').all() as {
    id: number;
    name: string;
  }[];

  if (!topicInput || topicInput.trim().length === 0) {
    // Se só existe 1 categoria no banco, sugere ela
    if (allCategories.length === 1) {
      return allCategories[0];
    }
    return null;
  }

  const clean = topicInput.trim();

  // 1. Tentar por ID numérico
  if (/^\d+$/.test(clean)) {
    const byId = allCategories.find(cat => cat.id === Number(clean));
    if (byId) return byId;
  }

  // 2. Tentar correspondência exata de nome (case-insensitive)
  const exact = allCategories.find(cat => cat.name.toLowerCase() === clean.toLowerCase());
  if (exact) return exact;

  // 3. Tentar correspondência parcial
  const partial = allCategories.find(cat => cat.name.toLowerCase().includes(clean.toLowerCase()));
  if (partial) return partial;

  // 4. Se não encontrar, cria ou obtém
  const newId = getOrCreateCategory(clean);
  return { id: newId, name: clean };
}

async function main() {
  console.log(`\n${c.cyan}${c.bold}======================================================${c.reset}`);
  console.log(`${c.cyan}${c.bold}  CardsConcurso - Validador & Reparador de Staging    ${c.reset}`);
  console.log(`${c.dim}  Banca: FCC | Concurso Alvo: TCE-GO                   ${c.reset}`);
  console.log(`${c.cyan}${c.bold}======================================================${c.reset}\n`);

  const options = {
    file: { type: 'string' as const, short: 'f' },
    topic: { type: 'string' as const, short: 't' },
    import: { type: 'boolean' as const, short: 'i' },
    output: { type: 'string' as const, short: 'o' },
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
    console.error(`${c.red}[ERRO] Argumentos CLI inválidos: ${err.message}${c.reset}`);
    process.exit(1);
  }

  if (parsedArgs.values.help) {
    console.log(`Uso:
  npm run validate-questions [opcoes]

Opcoes:
  --file, -f       Caminho do arquivo de staging (padrao: "naoValidado.txt")
  --topic, -t      Nome ou ID da materia/categoria no banco SQLite
  --import, -i     Importa automaticamente para o SQLite se estiver valido
  --output, -o     Caminho para salvar o JSON reparado (padrao: "naoValidado.repaired.json")
  --help, -h       Exibe esta ajuda

Exemplos:
  npm run validate-questions
  npm run validate-questions -- --import --topic "Lingua Portuguesa"
  npm run validate-questions -- -f meuLote.txt --import -t 2
`);
    process.exit(0);
  }

  // 1. Determinar arquivos de entrada e saída
  let inputFilePath: string;
  const specifiedFile = parsedArgs.values.file || parsedArgs.positionals[0];

  if (specifiedFile) {
    inputFilePath = path.resolve(process.cwd(), specifiedFile);
  } else {
    // Busca inteligente: verifica naoValidado.txt ou naoValidado.json
    if (fs.existsSync(path.resolve(process.cwd(), 'naoValidado.txt'))) {
      inputFilePath = path.resolve(process.cwd(), 'naoValidado.txt');
    } else if (fs.existsSync(path.resolve(process.cwd(), 'naoValidado.json'))) {
      inputFilePath = path.resolve(process.cwd(), 'naoValidado.json');
    } else {
      inputFilePath = path.resolve(process.cwd(), 'naoValidado.txt');
    }
  }

  const defaultOutputDir = path.dirname(inputFilePath);
  const defaultOutputBase = path.basename(inputFilePath, path.extname(inputFilePath));
  const outputFilePath = path.resolve(
    process.cwd(),
    parsedArgs.values.output || path.join(defaultOutputDir, `${defaultOutputBase}.repaired.json`)
  );

  console.log(`[ARQUIVO STAGING] ${c.bold}${inputFilePath}${c.reset}`);

  if (!fs.existsSync(inputFilePath)) {
    console.error(`\n${c.red}[ERRO] Arquivo não encontrado: ${inputFilePath}${c.reset}`);
    console.log(`Cole o JSON gerado pelo Gemini no arquivo e tente novamente.\n`);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(inputFilePath, 'utf-8');
  if (rawContent.trim().length === 0) {
    console.error(`\n${c.red}[ERRO] O arquivo está vazio!${c.reset}\n`);
    process.exit(1);
  }

  // 2. Tentativa de parsing direto ou auto-reparo
  let questionsData: any = null;
  let wasRepaired = false;
  let repairDetails: string[] = [];

  try {
    questionsData = JSON.parse(rawContent);
    console.log(`[SINTAXE] ${c.green}JSON original válido sem necessidade de correções sintáticas!${c.reset}`);
  } catch (originalSyntaxError: any) {
    displaySyntaxContext(rawContent, originalSyntaxError);

    console.log(`${c.yellow}[AUTO-REPAIR] Iniciando análise e auto-reparo inteligente de anomalias...${c.reset}`);
    const { repaired, changes } = repairJsonString(rawContent);

    try {
      questionsData = JSON.parse(repaired);
      wasRepaired = true;
      repairDetails = changes;

      // Gravar arquivo reparado
      fs.writeFileSync(outputFilePath, JSON.stringify(questionsData, null, 2), 'utf-8');

      console.log(`\n${c.green}${c.bold}[AUTO-REPAIR BEM-SUCEDIDO!]${c.reset}`);
      for (const change of changes) {
        console.log(`  ${c.cyan}✓${c.reset} ${change}`);
      }
      console.log(`[ARQUIVO GERADO] Salvo em: ${c.bold}${outputFilePath}${c.reset}`);
    } catch (repairedSyntaxError: any) {
      console.error(`\n${c.red}${c.bold}[ERRO ESTRUTURAL IRRECUPERÁVEL AUTOMATICAMENTE]${c.reset}`);
      console.error(
        `${c.red}O JSON possui anomalias que excedem o padrão de aspas/vírgulas (ex: resposta cortada no meio por estourar tokens do chat).${c.reset}`
      );
      console.error(`Detalhe: ${repairedSyntaxError.message}`);
      console.log(`\n${c.yellow}${c.bold}AÇÃO RECOMENDADA:${c.reset}`);
      console.log(
        `Chame o assistente de IA para examinar e consertar manualmente o conteúdo de ${path.basename(inputFilePath)}.\n`
      );
      process.exit(1);
    }
  }

  // Se o JSON original já era válido, salvar também a versão normalizada e formatada no arquivo reparado
  if (!wasRepaired) {
    fs.writeFileSync(outputFilePath, JSON.stringify(questionsData, null, 2), 'utf-8');
    console.log(`[CÓPIA FORMATADA] Salva em: ${c.bold}${outputFilePath}${c.reset}`);
  }

  // 3. Validação das Regras de Negócio do Projeto
  console.log(`\n[VALIDAÇÃO DE BANCA & SCHEMA] Verificando regras de negócio FCC...`);
  const validation = validateQuestionSchema(questionsData);

  if (!validation.valid) {
    console.error(`\n${c.red}${c.bold}[FALHA NAS REGRAS DE NEGÓCIO] Encontrados ${validation.errors.length} erro(s):${c.reset}`);
    for (const err of validation.errors) {
      console.error(`  ${c.red}✖${c.reset} ${err}`);
    }
    console.log(`\n${c.yellow}Corrija os pontos apontados acima ou chame o assistente para auxiliar.\n${c.reset}`);
    process.exit(1);
  }

  const typedQuestions = questionsData as GeneratedQuestion[];
  console.log(`${c.green}${c.bold}[APROVADO] Todas as ${typedQuestions.length} questões atendem estritamente aos requisitos de banca!${c.reset}`);

  // 4. Exibir Resumo Estruturado das Questões
  console.log(`\n${c.bold}------------------------------------------------------${c.reset}`);
  console.log(`${c.bold}RESUMO DO LOTE AVALIADO:${c.reset}`);
  console.log(`   - Quantidade total: ${c.bold}${typedQuestions.length} questões${c.reset}`);

  let easyCount = 0;
  let medCount = 0;
  let hardCount = 0;

  typedQuestions.forEach((q, idx) => {
    if (q.difficulty <= 3) easyCount++;
    else if (q.difficulty <= 7) medCount++;
    else hardCount++;

    const correctIdx = q.options.findIndex(opt => opt.is_correct);
    const correctLetter = correctIdx >= 0 ? OPTION_LETTERS[correctIdx] : '?';
    const previewStmt = q.statement.replace(/\s+/g, ' ').trim().slice(0, 75);

    console.log(
      `   ${c.cyan}Q${idx + 1}:${c.reset} [Dif. ${String(q.difficulty).padStart(2)}/10] [Gabarito: ${c.green}${correctLetter}${c.reset}] "${previewStmt}..."`
    );
  });

  console.log(
    `   - Distribuição de complexidade: ${c.green}${easyCount} fácil${c.reset} | ${c.yellow}${medCount} média${c.reset} | ${c.magenta}${hardCount} difícil${c.reset}`
  );
  console.log(`${c.bold}------------------------------------------------------${c.reset}\n`);

  // 5. Ingestão / Importação no SQLite (se solicitada via --import)
  const shouldImport = parsedArgs.values.import === true;
  const topicArg = parsedArgs.values.topic;

  if (shouldImport) {
    console.log(`[IMPORTAÇÃO] Ingestão no banco SQLite solicitada via --import...`);

    const category = resolveCategory(topicArg);

    if (!category) {
      console.error(`\n${c.red}[ERRO DE IMPORTAÇÃO] Matéria não especificada ou não encontrada.${c.reset}`);
      const categories = db.prepare('SELECT id, name FROM categories ORDER BY id ASC').all() as {
        id: number;
        name: string;
      }[];
      if (categories.length > 0) {
        console.log(`Categorias cadastradas no banco:`);
        for (const cat of categories) {
          console.log(`  - [ID #${cat.id}] "${cat.name}"`);
        }
      }
      console.log(`\nExecute novamente especificando a matéria:`);
      console.log(`npm run validate-questions -- --import --topic "<Nome ou ID da Matéria>"\n`);
      closeDb();
      process.exit(1);
    }

    console.log(`[CATEGORIA ALVO] ID #${category.id} - "${category.name}"`);

    // Prevenção contra duplicatas no banco
    const existingStatements = getExistingStatements(category.id);
    const existingSet = new Set(existingStatements.map(s => s.trim().toLowerCase()));

    const questionsToInsert: GeneratedQuestion[] = [];
    let duplicatesCount = 0;

    for (const q of typedQuestions) {
      if (existingSet.has(q.statement.trim().toLowerCase())) {
        duplicatesCount++;
      } else {
        questionsToInsert.push(q);
      }
    }

    if (duplicatesCount > 0) {
      console.log(
        `${c.yellow}[DUPLICATAS IGNORADAS] ${duplicatesCount} questão(ões) já constam cadastradas nesta matéria no banco.${c.reset}`
      );
    }

    if (questionsToInsert.length === 0) {
      console.log(
        `\n${c.yellow}[AVISO] Nenhuma nova questão a inserir. Todas as ${typedQuestions.length} questões já existem no banco.${c.reset}\n`
      );
      closeDb();
      process.exit(0);
    }

    // Gravação transacional no banco
    const insertResult = insertQuestionBatchTransaction(category.id, questionsToInsert);
    const updatedTotal = getQuestionsCount(category.id);

    console.log(`\n${c.green}${c.bold}======================================================${c.reset}`);
    console.log(`${c.green}${c.bold}INGESTÃO CONCLUÍDA COM SUCESSO NO BANCO DE DADOS!     ${c.reset}`);
    console.log(`   - Matéria:            "${category.name}" (ID #${category.id})`);
    console.log(`   - Novas Questões:     +${insertResult.insertedQuestions}`);
    console.log(`   - Novas Alternativas: +${insertResult.insertedOptions}`);
    console.log(`   - Total no Banco:     ${updatedTotal} questões`);
    console.log(`${c.green}${c.bold}======================================================${c.reset}\n`);
  } else {
    // Sugestão para o usuário de como importar
    const categories = db.prepare('SELECT id, name FROM categories ORDER BY id ASC').all() as {
      id: number;
      name: string;
    }[];
    const defaultSuggestion = categories.length > 0 ? categories[0].name : 'Controle Externo';

    console.log(`${c.cyan}${c.bold}[PRONTO PARA IMPORTAÇÃO]${c.reset}`);
    console.log(`O lote está 100% validado e pronto.`);
    console.log(`Para inseri-lo no banco de dados SQLite automaticamente, basta rodar:`);
    console.log(
      `  ${c.bold}npm run validate-questions -- --import --topic "${defaultSuggestion}"${c.reset}\n`
    );
  }

  closeDb();
  process.exit(0);
}

main().catch(err => {
  console.error(`\n${c.red}[ERRO FATAL NÃO TRATADO]${c.reset}`, err);
  closeDb();
  process.exit(1);
});
