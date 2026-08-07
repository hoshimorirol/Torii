import { SlashCommandBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { MissionRepository } from '../../../application/ports/MissionRepository';

export const expedienteCommand = new SlashCommandBuilder()
  .setName('expediente')
  .setDescription('Gestion de expedientes del Santuario')
  .addSubcommand(sub =>
    sub.setName('crear').setDescription('Crear un nuevo expediente')
  )
  .addSubcommand(sub =>
    sub.setName('ver').setDescription('Ver un expediente')
      .addStringOption(opt => opt.setName('codigo').setDescription('Codigo del expediente').setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName('mis_borradores').setDescription('Ver tus borradores')
  );

export async function handleExpedienteCommand(interaction: ChatInputCommandInteraction, missionRepository: MissionRepository) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'crear') {
    const modal = new ModalBuilder()
      .setCustomId('modal_crear_expediente')
      .setTitle('Nuevo Expediente');

    const titulo = new TextInputBuilder()
      .setCustomId('titulo')
      .setLabel('Titulo de la expedicion')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(100);

    const descripcion = new TextInputBuilder()
      .setCustomId('descripcion')
      .setLabel('Descripcion / Llamada del Santuario')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(4000);

    const imagen = new TextInputBuilder()
      .setCustomId('imagen')
      .setLabel('URL de imagen o GIF (opcional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const plazasMin = new TextInputBuilder()
      .setCustomId('plazas_min')
      .setLabel('Plazas minimas')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue('3');

    const plazasMax = new TextInputBuilder()
      .setCustomId('plazas_max')
      .setLabel('Plazas maximas')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue('6');

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titulo),
      new ActionRowBuilder<TextInputBuilder>().addComponents(descripcion),
      new ActionRowBuilder<TextInputBuilder>().addComponents(imagen),
      new ActionRowBuilder<TextInputBuilder>().addComponents(plazasMin),
      new ActionRowBuilder<TextInputBuilder>().addComponents(plazasMax)
    );

    await interaction.showModal(modal);
    return;
  }

  if (subcommand === 'ver') {
    const codigo = interaction.options.getString('codigo', true);
    const mission = await missionRepository.findByCode(codigo);
    if (!mission) {
      await interaction.reply({ content: 'Expediente no encontrado.', ephemeral: true });
      return;
    }
    await interaction.reply({ content: `**${mission.title}**\nEstado: ${mission.status}\n${mission.description.substring(0, 200)}...`, ephemeral: true });
    return;
  }

  if (subcommand === 'mis_borradores') {
    const missions = await missionRepository.findBySensei(interaction.user.id, ['BORRADOR']);
    if (missions.length === 0) {
      await interaction.reply({ content: 'No tienes borradores activos.', ephemeral: true });
      return;
    }
    const list = missions.map(m => `• ${m.code} - ${m.title}`).join('\n');
    await interaction.reply({ content: `Tus borradores:\n${list}`, ephemeral: true });
    return;
  }
}