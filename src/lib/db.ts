import Database from 'better-sqlite3';
import path from 'path';

// Define o caminho para o banco de dados. No desenvolvimento, fica na raiz do projeto.
const dbPath = path.join(process.cwd(), 'database.sqlite');

// Opção para logar as queries, útil em debug: verbose: console.log
const db = new Database(dbPath, { /* verbose: console.log */ });

// Otimizações do SQLite para melhor performance
db.pragma('journal_mode = WAL');

export default db;
