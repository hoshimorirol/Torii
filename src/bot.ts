// Register ts-node for TypeScript migrations in production
if (process.env.NODE_ENV === 'production') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('ts-node/register');
    console.log('[DB] ts-node registered for TypeScript migrations');
  } catch {
    console.log('[DB] ts-node not available, assuming compiled migrations');
  }
}

import { Events, Interaction } from 'discord.js';
import { client, commands, registerCommands } from './infrastructure/discord/client';
import { env } from './infrastructure/config/env';
import { db } from './infrastructure/database/connection';
import { SqliteMissionRepository } from './infrastructure/database/repositories/SqliteMissionRepository';
import { CreateMission } from './application/services/CreateMission';
import { expedienteCommand, handleExpedienteCommand } from './infrastructure/discord/commands/expediente';
import { explorarCommand, handleExplorarCommand } from './infrastructure/discord/commands/explorar';
import { ayudaCommand, handleAyudaCommand } from './infrastructure/discord/commands/ayuda';
import { handleModalSubmit } from './infrastructure/discord/interactions/modalHandlers';
import { handleButtonInteraction } from './infrastructure/discord/interactions/buttonHandlers';

async function main() {
  // Run database migrations automatically on startup
  try {
    console.log('[DB] Running migrations...');
    await db.migrate.latest();
    console.log('[DB] Migrations completed successfully');
  } catch (err: any) {
    console.error('[DB] Migration failed:', err.message || err);
  }

  // Initialize database
  const missionRepository = new SqliteMissionRepository();
  const createMissionUseCase = new CreateMission(missionRepository);

  // Register slash commands
  const commandData = [
    expedienteCommand.toJSON(),
    explorarCommand.toJSON(),
    ayudaCommand.toJSON(),
  ];
  await registerCommands(commandData);

  // Store command handlers
  commands.set('expediente', {
    execute: (interaction: any) => handleExpedienteCommand(interaction, missionRepository),
  });
  commands.set('explorar', {
    execute: (interaction: any) => handleExplorarCommand(interaction),
  });
  commands.set('ayuda', {
    execute: (interaction: any) => handleAyudaCommand(interaction),
  });

  // Event: Ready
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`[Torii] Logged in as ${readyClient.user.tag}`);
    console.log(`[Torii] Environment: ${env.NODE_ENV}`);
    console.log(`[Torii] Guild: ${env.DISCORD_GUILD_ID}`);
  });

  // Event: Interaction Create
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        const handler = commands.get(interaction.commandName);
        if (handler) {
          await handler.execute(interaction);
        }
        return;
      }

      if (interaction.isModalSubmit()) {
        await handleModalSubmit(interaction, createMissionUseCase, missionRepository);
        return;
      }

      if (interaction.isButton()) {
        await handleButtonInteraction(interaction, missionRepository);
        return;
      }
    } catch (error) {
      console.error('[Interaction] Unhandled error:', error);
      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Ha ocurrido un error inesperado.',
          ephemeral: true,
        });
      }
    }
  });

  // Login
  await client.login(env.DISCORD_TOKEN);
}

main().catch((error) => {
  console.error('[Torii] Fatal error:', error);
  process.exit(1);
});
