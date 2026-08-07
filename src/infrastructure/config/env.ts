import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  DISCORD_TOKEN: requireEnv('DISCORD_TOKEN'),
  DISCORD_CLIENT_ID: requireEnv('DISCORD_CLIENT_ID'),
  DISCORD_GUILD_ID: requireEnv('DISCORD_GUILD_ID'),
  DB_PATH: process.env.DB_PATH || './data/hoshizora.db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ROLE_SENSEI: process.env.ROLE_SENSEI || '',
  ROLE_HUNTER: process.env.ROLE_HUNTER || '',
  CHANNEL_TABLERO: process.env.CHANNEL_TABLERO || '',
  CHANNEL_ARCHIVO: process.env.CHANNEL_ARCHIVO || '',
};
