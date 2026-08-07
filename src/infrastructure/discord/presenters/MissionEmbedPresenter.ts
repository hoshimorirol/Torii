import { EmbedBuilder } from 'discord.js';
import { Mission } from '../../../core/entities/Mission';
import { MissionStatus } from '../../../core/value-objects/MissionStatus';

const statusColors: Record<string, number> = {
  [MissionStatus.BORRADOR]: 0x6B7280,
  [MissionStatus.PUBLICADA]: 0x3B82F6,
  [MissionStatus.INSCRIPCION_ABIERTA]: 0x10B981,
  [MissionStatus.COMPLETA]: 0xF59E0B,
  [MissionStatus.EN_CURSO]: 0xEF4444,
  [MissionStatus.FINALIZADA]: 0x8B5CF6,
  [MissionStatus.ARCHIVADA]: 0x78716C,
  [MissionStatus.CANCELADA]: 0x991B1B,
};

export function createMissionEmbed(mission: Mission): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`${mission.code} — ${mission.title}`)
    .setDescription(mission.description)
    .setColor(statusColors[mission.status] || 0x6B7280)
    .addFields(
      { name: '📊 Estado', value: mission.status, inline: true },
      { name: '👤 Sensei', value: `<@${mission.senseiId}>`, inline: true },
      { name: '🎲 Plazas', value: `${mission.slotsMin} - ${mission.slotsMax}`, inline: true }
    )
    .setFooter({ text: 'Torii — Sistema de Expediciones del Santuario' });

  if (mission.imageUrl) {
    embed.setImage(mission.imageUrl);
  }

  return embed;
}
