import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const explorarCommand = new SlashCommandBuilder()
  .setName('explorar')
  .setDescription('Archivo historico del Santuario')
  .addSubcommand(sub =>
    sub.setName('archivo').setDescription('Buscar en el archivo historico')
  );

export async function handleExplorarCommand(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: 'Archivo Historico del Santuario (Funcion en desarrollo - Fase 5)',
    ephemeral: true,
  });
}