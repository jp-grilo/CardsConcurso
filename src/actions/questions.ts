'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface ImportedQuestion {
  category: string;
  statement: string;
  difficulty: number;
  options: {
    text: string;
    is_correct: boolean;
    justification?: string;
  }[];
}

export async function importQuestionsFromJson(jsonData: string) {
  try {
    const questions: ImportedQuestion[] = JSON.parse(jsonData);
    if (!Array.isArray(questions)) throw new Error("O JSON deve ser um array de questões.");

    const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    const getCategory = db.prepare('SELECT id FROM categories WHERE name = ?');
    
    const insertQuestion = db.prepare(`
      INSERT INTO questions (category_id, statement, difficulty) 
      VALUES (?, ?, ?)
    `);
    
    const insertOption = db.prepare(`
      INSERT INTO options (question_id, text, is_correct, justification)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = db.transaction((qs: ImportedQuestion[]) => {
      for (const q of qs) {
        insertCategory.run(q.category);
        const categoryRow = getCategory.get(q.category) as { id: number };
        const categoryId = categoryRow.id;

        const qResult = insertQuestion.run(categoryId, q.statement, q.difficulty);
        const questionId = qResult.lastInsertRowid;

        for (const opt of q.options) {
          insertOption.run(questionId, opt.text, opt.is_correct ? 1 : 0, opt.justification || "");
        }
      }
    });

    transaction(questions);
    
    revalidatePath('/questoes');
    
    return { success: true, count: questions.length };
  } catch (error: any) {
    console.error("Erro na importação:", error);
    return { success: false, error: error.message };
  }
}

export async function getCategoriesWithCounts() {
  const stmt = db.prepare(`
    SELECT c.id, c.name, COUNT(q.id) as question_count
    FROM categories c
    LEFT JOIN questions q ON c.id = q.category_id
    GROUP BY c.id
    ORDER BY c.name ASC
  `);
  return stmt.all() as { id: number, name: string, question_count: number }[];
}

export interface CategoryQuestionOption {
  id: number;
  text: string;
  is_correct: boolean;
  justification: string | null;
}

export interface CategoryQuestion {
  id: number;
  statement: string;
  difficulty: number;
  options: CategoryQuestionOption[];
}

export async function getCategoryWithQuestions(categoryId: number) {
  const category = db
    .prepare('SELECT id, name FROM categories WHERE id = ?')
    .get(categoryId) as { id: number; name: string } | undefined;

  if (!category) return null;

  const questionRows = db
    .prepare('SELECT id, statement, difficulty FROM questions WHERE category_id = ? ORDER BY id ASC')
    .all(categoryId) as { id: number; statement: string; difficulty: number }[];

  const optionRows = db
    .prepare(`
      SELECT o.id, o.question_id, o.text, o.is_correct, o.justification
      FROM options o
      JOIN questions q ON q.id = o.question_id
      WHERE q.category_id = ?
      ORDER BY o.id ASC
    `)
    .all(categoryId) as {
      id: number;
      question_id: number;
      text: string;
      is_correct: number;
      justification: string | null;
    }[];

  const optionsByQuestion = new Map<number, CategoryQuestionOption[]>();
  for (const o of optionRows) {
    const list = optionsByQuestion.get(o.question_id) ?? [];
    list.push({ id: o.id, text: o.text, is_correct: !!o.is_correct, justification: o.justification });
    optionsByQuestion.set(o.question_id, list);
  }

  const questions: CategoryQuestion[] = questionRows.map(q => ({
    ...q,
    options: optionsByQuestion.get(q.id) ?? [],
  }));

  return { category, questions };
}

