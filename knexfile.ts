import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  client: 'better-sqlite3',
  connection: {
    filename: process.env.DB_PATH || './data/hoshizora.db',
  },
  useNullAsDefault: true,
  migrations: {
    directory: isProduction
      ? path.join(process.cwd(), 'dist', 'infrastructure', 'database', 'migrations')
      : path.join(process.cwd(), 'src', 'infrastructure', 'database', 'migrations'),
    loadExtensions: isProduction ? ['.js'] : ['.ts', '.js'],
  },
};