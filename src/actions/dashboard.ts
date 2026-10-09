'use server';

import db from '@/lib/db';

export async function getGlobalStats() {
  // Total de questões cadastradas
  const totalQuestionsRow = db.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number };
  
  // Total de sessões concluídas (simulados e estudos)
  const completedSessionsRow = db.prepare("SELECT COUNT(*) as count FROM sessions WHERE status = 'concluido'").get() as { count: number };
  
  // Acertos vs Erros Globais (apenas respostas que não são nulas)
  const stats = db.prepare(`
    SELECT 
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
      SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) as wrong
    FROM session_answers
    WHERE is_correct IS NOT NULL
  `).get() as { correct: number | null, wrong: number | null };

  const correct = stats.correct || 0;
  const wrong = stats.wrong || 0;
  const answered = correct + wrong;

  // Desempenho por Tópico (Top 5 Piores e Melhores, ou apenas a lista)
  const topicStats = db.prepare(`
    SELECT 
      c.name,
      COUNT(sa.id) as total_answered,
      SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) as correct
    FROM session_answers sa
    JOIN questions q ON sa.question_id = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE sa.is_correct IS NOT NULL
    GROUP BY c.id
    ORDER BY total_answered DESC
  `).all() as { name: string, total_answered: number, correct: number }[];

  return {
    totalQuestionsInBank: totalQuestionsRow.count,
    completedSessions: completedSessionsRow.count,
    globalCorrect: correct,
    globalWrong: wrong,
    totalAnswered: answered,
    topicStats
  };
}
