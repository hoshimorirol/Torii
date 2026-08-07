import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const explorarCommand = new SlashCommandBuilder()
  .setName('explorar')
  .setDescription('Archivo histórico del Santuario')
  .addSubcommand(sub =>
    sub.setName('archivo').setDescription('Buscar en el archivo histórico')
  );

export async function handleExplorarCommand(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: '📚 Archivo Histórico del Santuario\n*(Función en desarrollo — Fase 5)*',
    ephemeral: true,
  });
}
