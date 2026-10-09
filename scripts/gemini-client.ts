/**
 * gemini-client.ts
 *
 * Cliente de integração com a API do Google Gemini utilizando SDK oficial @google/genai
 * com suporte nativo a Structured Outputs (JSON Schema estrito), validação e retries.
 */

import { GoogleGenAI, Type, ThinkingLevel, type Schema } from '@google/genai';

export interface GeneratedOption {
  text: string;
  is_correct: boolean;
  justification: string;
}

export interface GeneratedQuestion {
  statement: string;
  difficulty: number;
  options: GeneratedOption[];
}

/**
 * Esquema estruturado JSON forçado para a resposta da API do Gemini
 */
export const QuestionBatchSchema: Schema = {
  type: Type.ARRAY,
  description: 'Lista de questões inéditas de múltipla escolha.',
  items: {
    type: Type.OBJECT,
    properties: {
      statement: {
        type: Type.STRING,
        description: 'Texto completo do enunciado da questão no padrão formal FCC.',
      },
      difficulty: {
        type: Type.INTEGER,
        description: 'Grau de dificuldade da questão (número inteiro de 1 a 10).',
      },
      options: {
        type: Type.ARRAY,
        description: 'Exatamente 5 alternativas de múltipla escolha (A, B, C, D, E).',
        items: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: 'Texto da assertiva/alternativa.',
            },
            is_correct: {
              type: Type.BOOLEAN,
              description: 'true se for a única alternativa correta (gabarito), false caso contrário.',
            },
            justification: {
              type: Type.STRING,
              description: 'Justificativa técnica fundamentada explicando o acerto ou erro da assertiva.',
            },
          },
          required: ['text', 'is_correct', 'justification'],
        },
      },
    },
    required: ['statement', 'difficulty', 'options'],
  },
};

/**
 * Validador estrito de regras de negócio para o lote retornado pela IA
 */
export function validateBatch(questions: any[], expectedCount: number): { valid: boolean; error?: string } {
  if (!Array.isArray(questions)) {
    return { valid: false, error: 'A resposta não é um array.' };
  }

  if (questions.length !== expectedCount) {
    return {
      valid: false,
      error: `Quantidade incorreta de questões: esperado ${expectedCount}, recebido ${questions.length}.`,
    };
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.statement || typeof q.statement !== 'string' || q.statement.trim().length < 15) {
      return { valid: false, error: `Questão ${i + 1} possui enunciado inválido ou muito curto.` };
    }

    const diff = Number(q.difficulty);
    if (isNaN(diff) || diff < 1 || diff > 10) {
      return { valid: false, error: `Questão ${i + 1} possui dificuldade fora da faixa 1-10 (${q.difficulty}).` };
    }

    if (!Array.isArray(q.options) || q.options.length !== 5) {
      return {
        valid: false,
        error: `Questão ${i + 1} não possui exatamente 5 alternativas (recebeu ${q.options?.length}).`,
      };
    }

    const correctCount = q.options.filter((opt: any) => opt.is_correct === true).length;
    if (correctCount !== 1) {
      return {
        valid: false,
        error: `Questão ${i + 1} possui ${correctCount} alternativas corretas (deve ser estritamente 1).`,
      };
    }

    for (let j = 0; j < q.options.length; j++) {
      const opt = q.options[j];
      if (!opt.text || typeof opt.text !== 'string' || opt.text.trim().length === 0) {
        return { valid: false, error: `Questão ${i + 1}, alternativa ${j + 1} possui texto vazio.` };
      }
      if (!opt.justification || typeof opt.justification !== 'string' || opt.justification.trim().length === 0) {
        return { valid: false, error: `Questão ${i + 1}, alternativa ${j + 1} possui justificativa vazia.` };
      }
    }
  }

  return { valid: true };
}

/**
 * Realiza a chamada à API do Gemini com Structured Outputs e retentativas com backoff exponencial
 */
export async function generateQuestionBatch(
  systemInstruction: string,
  userPrompt: string,
  batchSize: number = 5,
  maxRetries: number = 3
): Promise<GeneratedQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Variável de ambiente GEMINI_API_KEY não definida no .env');
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const ai = new GoogleGenAI({ apiKey });

  // Nivel de raciocinio (thinking) configuravel via .env: MINIMAL | LOW | MEDIUM | HIGH
  const requestedLevel = (process.env.GEMINI_THINKING_LEVEL || 'HIGH').toUpperCase();
  const thinkingLevel =
    (ThinkingLevel as Record<string, ThinkingLevel>)[requestedLevel] ?? ThinkingLevel.HIGH;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: QuestionBatchSchema,
          temperature: 0.7,
          thinkingConfig: { thinkingLevel },
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error('A API retornou resposta vazia.');
      }

      let parsed: any;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr: any) {
        throw new Error(`Falha no parse do JSON retornado: ${parseErr.message}`);
      }

      const validation = validateBatch(parsed, batchSize);
      if (!validation.valid) {
        throw new Error(`Validação do lote falhou: ${validation.error}`);
      }

      return parsed as GeneratedQuestion[];
    } catch (err: any) {
      lastError = err;
      console.warn(`\n[AVISO API] Falha na tentativa ${attempt}/${maxRetries}: ${err.message}`);

      if (attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1500; // 3s, 6s...
        console.log(`[RETRY] Aguardando ${(backoffMs / 1000).toFixed(1)}s antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw new Error(`Esgotadas ${maxRetries} tentativas na API do Gemini. Último erro: ${lastError?.message}`);
}
