/**
 * db-service.ts
 *
 * Camada de persistência local SQLite para o utilitário de ingestão de questões.
 * Garante atomicidade nas inserções através de transações atômicas (BEGIN / COMMIT / ROLLBACK)
 * e fornece consultas otimizadas para prevenção de duplicatas e contagens de progresso.
 */

import Database from 'better-sqlite3';
import path from 'path';
import type { GeneratedQuestion } from './gemini-client';

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.join(process.cwd(), 'database.sqlite');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Retorna o ID da categoria existente ou cria uma nova caso não exista.
 */
export function getOrCreateCategory(categoryName: string): number {
  const findStmt = db.prepare('SELECT id FROM categories WHERE name = ?');
  const existing = findStmt.get(categoryName) as { id: number } | undefined;

  if (existing) {
    return existing.id;
  }

  const insertStmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
  const info = insertStmt.run(categoryName);
  return Number(info.lastInsertRowid);
}

/**
 * Retorna a quantidade total de questões cadastradas para a categoria informada.
 */
export function getQuestionsCount(categoryId: number): number {
  const stmt = db.prepare('SELECT COUNT(*) as total FROM questions WHERE category_id = ?');
  const row = stmt.get(categoryId) as { total: number };
  return row ? row.total : 0;
}

/**
 * Retorna todos os enunciados (statements) existentes de uma categoria.
 */
export function getExistingStatements(categoryId: number): string[] {
  const stmt = db.prepare('SELECT statement FROM questions WHERE category_id = ? ORDER BY id ASC');
  const rows = stmt.all(categoryId) as { statement: string }[];
  return rows.map(r => r.statement);
}

/**
 * Insere um lote de questões e suas respectivas alternativas em uma única TRANSAÇÃO ATÔMICA.
 * Se ocorrer qualquer falha durante a inserção, o better-sqlite3 realiza ROLLBACK automático.
 */
export function insertQuestionBatchTransaction(
  categoryId: number,
  questions: GeneratedQuestion[]
): { insertedQuestions: number; insertedOptions: number } {
  const insertQuestionStmt = db.prepare(`
    INSERT INTO questions (category_id, statement, difficulty)
    VALUES (?, ?, ?)
  `);

  const insertOptionStmt = db.prepare(`
    INSERT INTO options (question_id, text, is_correct, justification)
    VALUES (?, ?, ?, ?)
  `);

  let questionsCount = 0;
  let optionsCount = 0;

  const transaction = db.transaction((batch: GeneratedQuestion[]) => {
    for (const q of batch) {
      const qResult = insertQuestionStmt.run(categoryId, q.statement.trim(), q.difficulty);
      const questionId = qResult.lastInsertRowid;
      questionsCount++;

      for (const opt of q.options) {
        insertOptionStmt.run(
          questionId,
          opt.text.trim(),
          opt.is_correct ? 1 : 0,
          opt.justification ? opt.justification.trim() : ''
        );
        optionsCount++;
      }
    }
  });

  // Executar a transação
  transaction(questions);

  return {
    insertedQuestions: questionsCount,
    insertedOptions: optionsCount,
  };
}

/**
 * Encerra a conexão com o banco de forma graciosa se necessário
 */
export function closeDb(): void {
  try {
    db.close();
  } catch {
    // Ignorar se já estiver fechado
  }
}

export default db;
