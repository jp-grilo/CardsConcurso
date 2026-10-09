'use server';

import db from '@/lib/db';
import { redirect } from 'next/navigation';

export interface SimuladoTopicConfig {
  categoryId: number;
  questionCount: number;
  weight: number;
  targetDifficulty: number;
}

export async function createSimuladoSession(topics: SimuladoTopicConfig[]) {
  if (!topics || topics.length === 0) throw new Error("O simulado precisa de pelo menos um tópico.");

  const getQuestions = db.prepare(`
    SELECT id, difficulty, last_accessed_at, last_result 
    FROM questions 
    WHERE category_id = ?
  `);

  let selectedQuestionIds: number[] = [];
  let totalQuestions = 0;

  for (const topic of topics) {
    const allQuestions = getQuestions.all(topic.categoryId) as {
      id: number;
      difficulty: number;
      last_accessed_at: string | null;
      last_result: number | null; // 0 (false), 1 (true) ou null
    }[];

    // Calcula os pesos
    const scoredQuestions = allQuestions.map(q => {
      let score = 0;

      // 1. Dificuldade: mais pontos quanto mais próximo do targetDifficulty
      const diffDiff = Math.abs(q.difficulty - topic.targetDifficulty);
      // pontuação máxima 10, perde 1 ponto por cada nível de distância
      const diffScore = Math.max(0, 10 - diffDiff);
      score += diffScore;

      // 2. Erros anteriores: multiplicador ou bônus forte
      if (q.last_result === 0) {
        score += 15; // peso bem alto para quem errou
      }

      // 3. Tempo desde o último acesso: bônus se não acessou há muito tempo (ou nunca)
      if (!q.last_accessed_at) {
        score += 5; // questões novas ganham um empurrãozinho
      } else {
        const daysSince = (Date.now() - new Date(q.last_accessed_at).getTime()) / (1000 * 60 * 60 * 24);
        score += Math.min(10, daysSince); // ganha até 10 pontos extra dependendo dos dias
      }

      return { id: q.id, score, random: Math.random() }; // random para desempate
    });

    // Ordena pelo maior score e desempate com random
    scoredQuestions.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.random - a.random;
    });

    // Pega a quantidade solicitada
    const topQuestions = scoredQuestions.slice(0, topic.questionCount).map(sq => sq.id);
    
    // As questões já são selecionadas e embaralhadas internamente para essa matéria
    // Mas o loop garante que as matérias respeitarão a ordem definida no array 'topics'
    selectedQuestionIds = selectedQuestionIds.concat(topQuestions);
    totalQuestions += topQuestions.length;
  }

  if (selectedQuestionIds.length === 0) {
    throw new Error("Não há questões suficientes no banco para iniciar o simulado.");
  }

  // Cria a sessão
  const insertSession = db.prepare(`
    INSERT INTO sessions (mode, status, total_questions, config)
    VALUES ('simulado', 'em_andamento', ?, ?)
  `);

  const insertSessionAnswer = db.prepare(`
    INSERT INTO session_answers (session_id, question_id)
    VALUES (?, ?)
  `);

  let sessionId: number | bigint = 0;

  const transaction = db.transaction(() => {
    const sResult = insertSession.run(totalQuestions, JSON.stringify(topics));
    sessionId = sResult.lastInsertRowid;

    for (const qId of selectedQuestionIds) {
      insertSessionAnswer.run(sessionId, qId);
    }
    
    // (Opcional) Podemos salvar a configuração dos pesos/tópicos na tabela sessions se quisermos no futuro.
  });

  transaction();

  // Redireciona para a tela do simulado
  redirect(`/simulado/${sessionId}`);
}
