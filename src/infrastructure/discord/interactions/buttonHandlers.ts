import { ButtonInteraction } from 'discord.js';
import { MissionRepository } from '../../../application/ports/MissionRepository';
import { Mission } from '../../../core/entities/Mission';
import { MissionStatus } from '../../../core/value-objects/MissionStatus';

export async function handleButtonInteraction(
  interaction: ButtonInteraction,
  missionRepository: MissionRepository
) {
  const { customId } = interaction;

  try {
    // Ejemplo: publish_mission_123
    if (customId.startsWith('publish_mission_')) {
      const missionId = parseInt(customId.replace('publish_mission_', ''), 10);
      const mission = await missionRepository.findById(missionId);

      if (!mission) {
        await interaction.reply({ content: '❌ Expediente no encontrado.', ephemeral: true });
        return;
      }

      if (mission.senseiId !== interaction.user.id) {
        await interaction.reply({ content: '⛔ No tienes permiso para publicar este expediente.', ephemeral: true });
        return;
      }

      mission.publish();
      await missionRepository.update(mission);

      await interaction.reply({ content: '✅ Expediente publicado correctamente.', ephemeral: true });
      return;
    }

    // Ejemplo: open_enrollment_123
    if (customId.startsWith('open_enrollment_')) {
      const missionId = parseInt(customId.replace('open_enrollment_', ''), 10);
      const mission = await missionRepository.findById(missionId);

      if (!mission) {
        await interaction.reply({ content: '❌ Expediente no encontrado.', ephemeral: true });
        return;
      }

      if (mission.senseiId !== interaction.user.id) {
        await interaction.reply({ content: '⛔ No tienes permiso.', ephemeral: true });
        return;
      }

      mission.openEnrollment();
      await missionRepository.update(mission);

      await interaction.reply({ content: '📝 Inscripciones abiertas.', ephemeral: true });
      return;
    }

    // Ejemplo: delete_mission_123
    if (customId.startsWith('delete_mission_')) {
      const missionId = parseInt(customId.replace('delete_mission_', ''), 10);
      const mission = await missionRepository.findById(missionId);

      if (!mission) {
        await interaction.reply({ content: '❌ Expediente no encontrado.', ephemeral: true });
        return;
      }

      if (mission.senseiId !== interaction.user.id) {
        await interaction.reply({ content: '⛔ No tienes permiso para eliminar este expediente.', ephemeral: true });
        return;
      }

      await missionRepository.delete(missionId);
      await interaction.reply({ content: '🗑️ Expediente eliminado.', ephemeral: true });
      return;
    }

    await interaction.reply({ content: '❌ Acción no reconocida.', ephemeral: true });
  } catch (error) {
    console.error('[Button] Error:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ Error al procesar la acción.', ephemeral: true });
    }
  }
}
