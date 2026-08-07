import knex from 'knex';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: process.env.DB_PATH || './data/hoshizora.db',
  },
  useNullAsDefault: true,
  migrations: {
    directory: isProduction
      ? path.join(process.cwd(), 'src', 'infrastructure', 'database', 'migrations')
      : path.join(process.cwd(), 'src', 'infrastructure', 'database', 'migrations'),
    loadExtensions: ['.ts', '.js'],
  },
});

// Enable WAL mode and foreign keys
db.raw('PRAGMA journal_mode = WAL').then(() => {
  console.log('[DB] WAL mode enabled');
});
db.raw('PRAGMA foreign_keys = ON').then(() => {
  console.log('[DB] Foreign keys enabled');
});
