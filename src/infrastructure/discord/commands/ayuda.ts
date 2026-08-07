import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const ayudaCommand = new SlashCommandBuilder()
  .setName('ayuda')
  .setDescription('Guía del Santuario — Torii');

export async function handleAyudaCommand(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('⛩️ Guía del Santuario — Torii')
    .setDescription('Sistema oficial de gestión de expediciones. **Un solo comando, todo con botones.**')
    .setColor(0x8B5CF6)
    .addFields(
      {
        name: '📜 Sensei — Crear y Gestionar Expedientes',
        value:
          '**1 comando para crear:**
' +
          '`/expediente crear` → Abre un modal, llena los campos, listo.

' +
          '**Todo lo demás son botones en el embed:**
' +
          '📢 **Publicar** → Publica en #tablero y crea thread
' +
          '🏮 **Abrir Inscripciones** → Los cazadores pueden apuntarse
' +
          '🔒 **Cerrar** → Cierra inscripciones manualmente
' +
          '⚔️ **Iniciar** → La expedición comienza (En Curso)
' +
          '📖 **Finalizar** → Abre modal para escribir la bitácora
' +
          '🏛️ **Archivar** → Mueve a la Crónica del Santuario
' +
          '📝 **Editar** → Modifica título, descripción o notas
' +
          '🗑️ **Eliminar** → Borra el expediente (solo en borrador)',
      },
      {
        name: '🏹 Cazadores — Inscribirse en Expedientes',
        value:
          '**No necesitas comandos.**
' +
          'Cuando una expedición está en estado 🏮 **Inscripciones Abiertas**, ' +
          'aparece un botón en el embed:

' +
          '🙋 **Apuntarme** → Te inscribes (pide nombre de personaje)
' +
          '🚶 **Retirarme** → Cancelas tu inscripción',
      },
      {
        name: '📚 Archivo Histórico',
        value: '`/explorar archivo` → Buscador de todas las expediciones pasadas

Filtros disponibles: por Sensei, región, rango, categoría, fecha y búsqueda de texto libre en bitácoras.',
      },
      {
        name: '❓ Comandos disponibles',
        value:
          '`/expediente crear` — Crear nueva expedición (Sensei)
' +
          '`/expediente ver <código>` — Ver cualquier expedición
' +
          '`/explorar archivo` — Archivo histórico
' +
          '`/ayuda` — Esta guía',
      }
    )
    .setFooter({ text: 'Torii — Sistema de Expediciones del Santuario' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
