import { ButtonInteraction } from 'discord.js';
import { MissionRepository } from '../../../application/ports/MissionRepository';
import { MissionStatus, canTransition } from '../../../core/value-objects/MissionStatus';

export async function handleButtonInteraction(
  interaction: ButtonInteraction,
  missionRepository: MissionRepository
) {
  const customId = interaction.customId;
  const parts = customId.split('_');
  const action = parts[1];
  const missionId = parseInt(parts[2]);

  if (isNaN(missionId)) {
    await interaction.reply({ content: 'ID invalido.', ephemeral: true });
    return;
  }

  const mission = await missionRepository.findById(missionId);
  if (!mission) {
    await interaction.reply({ content: 'Expediente no encontrado.', ephemeral: true });
    return;
  }

  if (mission.senseiId !== interaction.user.id) {
    await interaction.reply({ content: 'Solo el Sensei de esta expedicion puede gestionarla.', ephemeral: true });
    return;
  }

  try {
    if (action === 'publicar') {
      if (!canTransition(mission.status, MissionStatus.PUBLICADA)) {
        await interaction.reply({ content: 'No se puede publicar desde este estado.', ephemeral: true });
        return;
      }
      const updated = await missionRepository.update(
        Mission.reconstitute({ ...mission.toData(), status: MissionStatus.PUBLICADA, publishedAt: new Date() })
      );
      await interaction.reply({ content: `Expediente ${updated.code} publicado.`, ephemeral: true });
      return;
    }

    if (action === 'eliminar') {
      if (mission.status !== MissionStatus.BORRADOR) {
        await interaction.reply({ content: 'Solo se pueden eliminar borradores.', ephemeral: true });
        return;
      }
      await missionRepository.delete(missionId);
      await interaction.reply({ content: `Expediente ${mission.code} eliminado.`, ephemeral: true });
      return;
    }

    await interaction.reply({ content: 'Accion en desarrollo.', ephemeral: true });
  } catch (error: any) {
    console.error('[Button] Error:', error);
    await interaction.reply({ content: `Error: ${error.message}`, ephemeral: true });
  }
}