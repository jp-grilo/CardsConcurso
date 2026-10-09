import db from './db';

export function setupDatabase() {
  console.log('Inicializando e verificando as tabelas do banco de dados...');

  // Ativar foreign keys
  db.pragma('foreign_keys = ON');

  // Criar as tabelas baseadas no nosso schema planejado
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      statement TEXT NOT NULL,
      difficulty INTEGER NOT NULL CHECK(difficulty >= 1 AND difficulty <= 10),
      last_accessed_at DATETIME,
      last_result BOOLEAN,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      justification TEXT,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      config TEXT NOT NULL -- Guardará o JSON de configuração da prova
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mode TEXT NOT NULL CHECK(mode IN ('simulado', 'estudo')),
      status TEXT NOT NULL DEFAULT 'em_andamento' CHECK(status IN ('em_andamento', 'concluido')),
      current_question_index INTEGER DEFAULT 0,
      time_elapsed_seconds INTEGER DEFAULT 0,
      total_questions INTEGER NOT NULL,
      config TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      is_correct BOOLEAN,
      time_spent_seconds INTEGER DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
  `);

  console.log('Tabelas verificadas/criadas com sucesso!');
}
