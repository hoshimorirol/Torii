import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

export const ayudaCommand = new SlashCommandBuilder()
  .setName('ayuda')
  .setDescription('Muestra el panel de ayuda de Torii');

export async function handleAyudaCommand(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle('📖 Panel de Ayuda — Torii Bot')
    .setDescription('Bienvenido al sistema de gestión de expediciones de Hoshizora.')
    .addFields(
      {
        name: '/expediente crear',
        value: 'Crea un nuevo expediente de misión (solo Sensei).',
      },
      {
        name: '/expediente listar',
        value: 'Muestra tus expediciones en curso o historial.',
      },
      {
        name: '/explorar',
        value: 'Muestra las expediciones disponibles para unirse.',
      },
      {
        name: '/ayuda',
        value: 'Muestra este panel de ayuda.',
      }
    )
    .setFooter({ text: 'Torii Bot • Sistema Hoshizora' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
