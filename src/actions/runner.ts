'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getSessionData(sessionId: number) {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;
  if (!session) throw new Error("Sessão não encontrada.");

  if (session.status === 'concluido') {
    redirect(`/simulado/${sessionId}/resultado`);
  }

  // Busca as questões da sessão com suas alternativas
  const answers = db.prepare(`
    SELECT sa.question_id, sa.is_correct, sa.time_spent_seconds, 
           q.statement, q.category_id, c.name as category_name
    FROM session_answers sa
    JOIN questions q ON sa.question_id = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE sa.session_id = ?
    ORDER BY sa.id ASC
  `).all(sessionId) as any[];

  // Busca as alternativas para cada questão
  const questionIds = answers.map(a => a.question_id);
  const getOptions = db.prepare(`SELECT id, text, is_correct, justification FROM options WHERE question_id = ?`);
  
  const questions = answers.map(ans => {
    const options = getOptions.all(ans.question_id) as any[];
    // Embaralha as alternativas para que não fiquem sempre na mesma ordem
    options.sort(() => Math.random() - 0.5);

    return {
      id: ans.question_id,
      category: ans.category_name,
      statement: ans.statement,
      options: options.map(o => ({ id: o.id, text: o.text })), // Esconde is_correct do cliente
    };
  });

  return {
    session: {
      id: session.id,
      mode: session.mode,
      currentQuestionIndex: session.current_question_index,
      timeElapsedSeconds: session.time_elapsed_seconds,
      totalQuestions: session.total_questions
    },
    questions
  };
}

// Salva o progresso quando o usuário avança/retorna ou fecha a janela
export async function saveSessionProgress(sessionId: number, currentIndex: number, timeElapsed: number, userAnswers: Record<number, number>) {
  const updateSession = db.prepare(`
    UPDATE sessions 
    SET current_question_index = ?, time_elapsed_seconds = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  // userAnswers é um mapa { question_id: option_id_escolhida }
  // Não checamos se está certo ainda, apenas guardamos temporariamente na tabela (precisamos adicionar uma coluna ou tabela para rascunho se quisermos).
  // Porém, o SQLite pode não ter a resposta escolhida ainda.
  // Vamos atualizar apenas o progresso de navegação e tempo. 
  // O estado das escolhas pode ficar no localstorage do cliente para não sobrecarregar o DB a cada clique, 
  // ou podemos salvar num campo JSON no session. Para simplificar e rodar localmente sem atraso, 
  // faremos a validação e o save do gabarito definitivo no `finishSession`.

  updateSession.run(currentIndex, timeElapsed, sessionId);
  return { success: true };
}

export async function finishSession(sessionId: number, timeElapsed: number, userAnswers: Record<number, number>) {
  const getOptions = db.prepare('SELECT id, is_correct FROM options WHERE question_id = ?');
  const updateAnswer = db.prepare(`
    UPDATE session_answers 
    SET is_correct = ? 
    WHERE session_id = ? AND question_id = ?
  `);
  const updateQuestionStats = db.prepare(`
    UPDATE questions 
    SET last_accessed_at = CURRENT_TIMESTAMP, last_result = ?
    WHERE id = ?
  `);
  
  const finishSessionQuery = db.prepare(`
    UPDATE sessions 
    SET status = 'concluido', time_elapsed_seconds = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  db.transaction(() => {
    // 1. Marca a sessão como concluída
    finishSessionQuery.run(timeElapsed, sessionId);

    // 2. Avalia cada questão respondida
    for (const [qIdStr, optId] of Object.entries(userAnswers)) {
      const qId = parseInt(qIdStr);
      const options = getOptions.all(qId) as { id: number, is_correct: number }[];
      
      const chosenOption = options.find(o => o.id === optId);
      const isCorrect = chosenOption ? (chosenOption.is_correct === 1) : false;

      // Salva no gabarito da sessão
      updateAnswer.run(isCorrect ? 1 : 0, sessionId, qId);

      // Salva nas estatísticas permanentes da questão (peso para o algoritmo)
      updateQuestionStats.run(isCorrect ? 1 : 0, qId);
    }
  })();

  revalidatePath(`/simulado/${sessionId}`);
  redirect(`/simulado/${sessionId}/resultado`);
}
