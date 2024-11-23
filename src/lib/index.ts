import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { tasks } from './schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);

// Uncomment and run this function once to create the table
// export const createTable = () => {
//   sqlite.exec(`
//     CREATE TABLE IF NOT EXISTS tasks (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       category TEXT NOT NULL,
//       is_repeating INTEGER NOT NULL DEFAULT 0,
//       is_completed INTEGER NOT NULL DEFAULT 0,
//       created_at INTEGER NOT NULL DEFAULT (unixepoch())
//     )
//   `);
// };

