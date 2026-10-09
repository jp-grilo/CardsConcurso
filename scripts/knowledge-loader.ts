/**
 * knowledge-loader.ts
 *
 * Carregador de fontes e materiais de ancoragem (Grounding) para o concurso do TCE-GO.
 * Localiza e extrai seções relevantes do edital e exemplos reais de questões das provas/simulados.
 */

import fs from 'fs';
import path from 'path';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'scripts', 'knowledge');
const EDITAL_DIR = path.join(KNOWLEDGE_DIR, 'edital');
const PROVAS_DIR = path.join(KNOWLEDGE_DIR, 'provas');

interface TopicKnowledge {
  editalSummary: string;
  sampleQuestions: string;
}

/**
 * Normaliza string para busca semântica simples
 */
function normalizeForSearch(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Lê o edital consolidado e extrai trechos pertinentes ao tópico informado
 */
export function loadKnowledgeForTopic(topic: string): TopicKnowledge {
  const normTopic = normalizeForSearch(topic);
  let editalSummary = '';
  let sampleQuestions = '';

  // 1. Buscar no Edital
  const editalFile = path.join(EDITAL_DIR, 'conteudo_programatico_tce_go.md');
  if (fs.existsSync(editalFile)) {
    const content = fs.readFileSync(editalFile, 'utf-8');
    const lines = content.split('\n');
    const matchedLines: string[] = [];
    let capturing = false;

    // Se o tópico possui ' - ', a parte específica é a mais seletiva
    const specificPart = topic.includes(' - ') ? normalizeForSearch(topic.split(' - ')[1].trim()) : normTopic;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const normLine = normalizeForSearch(line);

      // Correspondência com o título do Micro Bloco
      if (!capturing) {
        if (line.startsWith('### Micro Bloco:') && normLine.includes(specificPart)) {
          capturing = true;
        } else if (!topic.includes(' - ') && normLine.includes(normTopic)) {
          capturing = true;
        }
      }

      if (capturing) {
        // Se encontrar o próximo bloco após ter capturado conteúdo, encerra a captura
        if (matchedLines.length > 1 && (line.startsWith('### Micro Bloco:') || line.startsWith('## Macro Bloco:') || line.startsWith('# PARTE'))) {
          break;
        }
        matchedLines.push(line);
        if (matchedLines.length > 30) break;
      }
    }

    if (matchedLines.length > 0) {
      editalSummary = matchedLines.join('\n').trim();
    } else {
      // Se não encontrou uma seção específica, inclui um resumo das diretrizes gerais do edital
      editalSummary = lines.slice(0, 35).join('\n').trim();
    }
  }

  // 2. Buscar questões de exemplo na prova e no simulado
  const simuladoFile = path.join(PROVAS_DIR, 'simulado_1_tce_go_questoes.md');
  if (fs.existsSync(simuladoFile)) {
    const content = fs.readFileSync(simuladoFile, 'utf-8');
    const questions = content.split(/(?=Questão \d+|QUESTÃO \d+)/i);

    for (const q of questions) {
      const normQ = normalizeForSearch(q);
      if (normTopic.split(' ').some(w => w.length > 3 && normQ.includes(w))) {
        // Encontrou questão relevante para usar de referência de estilo
        sampleQuestions = q.substring(0, 900).trim();
        break;
      }
    }
  }

  return {
    editalSummary,
    sampleQuestions
  };
}
