'use server';

import db from '@/lib/db';
import { SimuladoTopicConfig } from './sessions';

export async function getSimuladoResults(sessionId: number) {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;
  if (!session) throw new Error("Sessão não encontrada.");
  
  if (session.status !== 'concluido') {
    throw new Error("O simulado ainda não foi concluído.");
  }

  const topicsConfig: SimuladoTopicConfig[] = session.config ? JSON.parse(session.config) : [];
  
  // Create weight map
  const weightMap: Record<number, number> = {};
  for (const t of topicsConfig) {
    weightMap[t.categoryId] = t.weight;
  }

  // Fetch answers
  const answers = db.prepare(`
    SELECT sa.question_id, sa.is_correct, 
           q.statement, q.category_id, c.name as category_name
    FROM session_answers sa
    JOIN questions q ON sa.question_id = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE sa.session_id = ?
  `).all(sessionId) as any[];

  // Attach options for the gabarito
  const getOptions = db.prepare('SELECT text, is_correct, justification FROM options WHERE question_id = ?');
  
  const detailedAnswers = answers.map(ans => {
    const options = getOptions.all(ans.question_id) as any[];
    return {
      id: ans.question_id,
      categoryId: ans.category_id,
      categoryName: ans.category_name,
      statement: ans.statement,
      isCorrect: ans.is_correct === 1,
      isBlank: ans.is_correct === null, // no user answers saved yet = blank (if we supported null, but our finishSession defaults to false if no answer... wait)
      weight: weightMap[ans.category_id] || 1,
      options
    };
  });

  return {
    timeElapsedSeconds: session.time_elapsed_seconds,
    detailedAnswers,
    topics: topicsConfig
  };
}
