import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from 'dotenv';

config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

export const commands = new Collection<string, any>();

export async function registerCommands(commandData: any[]) {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  const guildId = process.env.DISCORD_GUILD_ID!;
  const clientId = process.env.DISCORD_CLIENT_ID!;

  try {
    console.log(`[Discord] Registering ${commandData.length} slash commands...`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandData }
    );
    console.log('[Discord] Slash commands registered successfully.');
  } catch (error) {
    console.error('[Discord] Failed to register commands:', error);
  }
}