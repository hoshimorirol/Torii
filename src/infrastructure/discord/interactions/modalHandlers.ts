import { ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CreateMission } from '../../../application/services/CreateMission';
import { MissionRepository } from '../../../application/ports/MissionRepository';

export async function handleModalSubmit(
  interaction: ModalSubmitInteraction,
  createMissionUseCase: CreateMission,
  missionRepository: MissionRepository
) {
  if (interaction.customId === 'modal_crear_expediente') {
    try {
      const title = interaction.fields.getTextInputValue('titulo');
      const description = interaction.fields.getTextInputValue('descripcion');
      const imageUrl = interaction.fields.getTextInputValue('imagen') || undefined;
      const slotsMin = parseInt(interaction.fields.getTextInputValue('plazas_min')) || 3;
      const slotsMax = parseInt(interaction.fields.getTextInputValue('plazas_max')) || 6;

      const mission = await createMissionUseCase.execute(
        { title, description, imageUrl, slotsMin, slotsMax },
        interaction.user.id
      );

      const embed = new EmbedBuilder()
        .setTitle(`${mission.code} - ${mission.title}`)
        .setDescription(mission.description)
        .setColor(0x6B7280)
        .addFields(
          { name: 'Estado', value: mission.status, inline: true },
          { name: 'Sensei', value: `<@${mission.senseiId}>`, inline: true },
          { name: 'Plazas', value: `${mission.slotsMin} - ${mission.slotsMax}`, inline: true }
        )
        .setFooter({ text: 'Torii - Sistema de Expediciones del Santuario' });

      if (mission.imageUrl) {
        embed.setImage(mission.imageUrl);
      }

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`btn_editar_${mission.id}`).setLabel('Editar').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`btn_publicar_${mission.id}`).setLabel('Publicar').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`btn_eliminar_${mission.id}`).setLabel('Eliminar').setStyle(ButtonStyle.Danger)
      );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    } catch (error: any) {
      console.error('[Modal] Error creating mission:', error);
      await interaction.reply({
        content: `Error: ${error.message || 'No se pudo crear el expediente'}`,
        ephemeral: true,
      });
    }
    return;
  }
}