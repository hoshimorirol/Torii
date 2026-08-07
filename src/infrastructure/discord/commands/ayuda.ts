import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const ayudaCommand = new SlashCommandBuilder()
  .setName('ayuda')
  .setDescription('Guia del Santuario - Torii');

export async function handleAyudaCommand(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('Guia del Santuario - Torii')
    .setDescription('Sistema oficial de gestion de expediciones. Un solo comando, todo con botones.')
    .setColor(0x8B5CF6)
    .addFields(
      {
        name: 'Sensei - Crear y Gestionar Expedientes',
        value: '/expediente crear -> Abre un modal, llena los campos, listo. Todo lo demas son botones en el embed: Publicar, Abrir Inscripciones, Cerrar, Iniciar, Finalizar, Archivar, Editar, Eliminar.',
      },
      {
        name: 'Cazadores - Inscribirse en Expedientes',
        value: 'No necesitas comandos. Cuando una expedicion esta en estado Inscripciones Abiertas, aparece un boton en el embed: Apuntarme (te inscribes) o Retirarme (cancelas).',
      },
      {
        name: 'Archivo Historico',
        value: '/explorar archivo -> Buscador de todas las expediciones pasadas. Filtros: por Sensei, region, rango, categoria, fecha.',
      },
      {
        name: 'Comandos disponibles',
        value: '/expediente crear - Crear nueva expedicion (Sensei)\n/expediente ver <codigo> - Ver cualquier expedicion\n/explorar archivo - Archivo historico\n/ayuda - Esta guia',
      }
    )
    .setFooter({ text: 'Torii - Sistema de Expediciones del Santuario' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
