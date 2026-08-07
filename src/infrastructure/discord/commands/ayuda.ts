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
        value: `1 comando para crear:
/expediente crear -> Abre un modal, llena los campos, listo.

Todo lo demas son botones en el embed:
Publicar -> Publica en #tablero y crea thread
Abrir Inscripciones -> Los cazadores pueden apuntarse
Cerrar -> Cierra inscripciones manualmente
Iniciar -> La expedicion comienza (En Curso)
Finalizar -> Abre modal para escribir la bitacora
Archivar -> Mueve a la Cronica del Santuario
Editar -> Modifica titulo, descripcion o notas
Eliminar -> Borra el expediente (solo en borrador)`,
      },
      {
        name: 'Cazadores - Inscribirse en Expedientes',
        value: `No necesitas comandos.
Cuando una expedicion esta en estado Inscripciones Abiertas, aparece un boton en el embed:

Apuntarme -> Te inscribes (pide nombre de personaje)
Retirarme -> Cancelas tu inscripcion`,
      },
      {
        name: 'Archivo Historico',
        value: '/explorar archivo -> Buscador de todas las expediciones pasadas

Filtros disponibles: por Sensei, region, rango, categoria, fecha y busqueda de texto libre en bitacoras.',
      },
      {
        name: 'Comandos disponibles',
        value: `/expediente crear - Crear nueva expedicion (Sensei)
/expediente ver <codigo> - Ver cualquier expedicion
/explorar archivo - Archivo historico
/ayuda - Esta guia`,
      }
    )
    .setFooter({ text: 'Torii - Sistema de Expediciones del Santuario' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}