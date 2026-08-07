import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('regions', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.string('parent_region');
    table.boolean('is_custom').defaultTo(false);
  });

  await knex.schema.createTable('hunter_ranks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.integer('min_lv').notNullable();
    table.integer('max_lv').notNullable();
  });

  await knex.schema.createTable('templates', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description_base').notNullable();
    table.string('image_url');
    table.enum('difficulty', ['Baja', 'Media', 'Alta', 'Extrema']);
    table.integer('required_rank_id').references('id').inTable('hunter_ranks');
    table.integer('ratings_lang').defaultTo(0);
    table.integer('ratings_violence').defaultTo(0);
    table.integer('ratings_sexual').defaultTo(0);
    table.text('categories');
    table.text('platforms');
    table.integer('slots_min').defaultTo(3);
    table.integer('slots_max').defaultTo(6);
    table.integer('default_region_id').references('id').inTable('regions');
    table.text('extra_notes');
    table.string('created_by').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('missions', (table) => {
    table.increments('id').primary();
    table.string('code').notNullable().unique();
    table.string('title').notNullable();
    table.enum('status', [
      'BORRADOR','PUBLICADA','INSCRIPCION_ABIERTA',
      'COMPLETA','EN_CURSO','FINALIZADA','ARCHIVADA','CANCELADA'
    ]).notNullable();
    table.string('sensei_id').notNullable();
    table.text('description').notNullable();
    table.string('image_url');
    table.enum('difficulty', ['Baja', 'Media', 'Alta', 'Extrema']);
    table.integer('required_rank_id').references('id').inTable('hunter_ranks');
    table.integer('ratings_lang').defaultTo(0);
    table.integer('ratings_violence').defaultTo(0);
    table.integer('ratings_sexual').defaultTo(0);
    table.text('categories');
    table.text('platforms');
    table.integer('region_id').references('id').inTable('regions');
    table.string('region_custom');
    table.integer('slots_min').notNullable().defaultTo(3);
    table.integer('slots_max').notNullable().defaultTo(6);
    table.timestamp('scheduled_at');
    table.timestamp('published_at');
    table.timestamp('started_at');
    table.timestamp('closed_at');
    table.string('discord_message_id');
    table.string('discord_thread_id');
    table.text('extra_notes');
    table.text('tags');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('participants', (table) => {
    table.increments('id').primary();
    table.integer('mission_id').notNullable().references('id').inTable('missions').onDelete('CASCADE');
    table.string('user_id').notNullable();
    table.string('character_name');
    table.string('hunter_rank_at_enrollment');
    table.enum('status', ['INSCRITO','CONFIRMADO','AUSENTE','RETIRADO','EN_ESPERA']).defaultTo('INSCRITO');
    table.text('notes_sensei');
    table.timestamp('enrolled_at').defaultTo(knex.fn.now());
    table.unique(['mission_id', 'user_id']);
  });

  await knex.schema.createTable('waitlist', (table) => {
    table.increments('id').primary();
    table.integer('mission_id').notNullable().references('id').inTable('missions').onDelete('CASCADE');
    table.string('user_id').notNullable();
    table.string('character_name');
    table.timestamp('requested_at').defaultTo(knex.fn.now());
    table.integer('position').notNullable();
    table.boolean('notified').defaultTo(false);
    table.unique(['mission_id', 'user_id']);
  });

  await knex.schema.createTable('summaries', (table) => {
    table.increments('id').primary();
    table.integer('mission_id').notNullable().unique().references('id').inTable('missions').onDelete('CASCADE');
    table.text('narrative_summary').notNullable();
    table.text('consequences');
    table.text('rewards');
    table.text('additional_notes');
    table.text('attachments');
    table.string('written_by').notNullable();
    table.timestamp('closed_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('reminders', (table) => {
    table.increments('id').primary();
    table.integer('mission_id').notNullable().references('id').inTable('missions').onDelete('CASCADE');
    table.timestamp('trigger_at').notNullable();
    table.text('message').notNullable();
    table.boolean('sent').defaultTo(false);
    table.string('channel_id').notNullable();
  });

  await knex.schema.createTable('server_config', (table) => {
    table.string('guild_id').primary();
    table.string('role_sensei');
    table.string('role_hunter');
    table.string('channel_tablero');
    table.string('channel_archivo');
    table.text('default_reminders').defaultTo('[60,1440,10080]');
    table.integer('auto_archive_days').defaultTo(7);
    table.string('timezone').defaultTo('Europe/Madrid');
  });

  await knex('regions').insert([
    { name: 'Isla de Tsukishima', parent_region: 'Wa', is_custom: false },
    { name: 'Ciudad de Uwajima', parent_region: 'Wa', is_custom: false },
    { name: 'Islas Exteriores', parent_region: 'Wa', is_custom: false },
    { name: 'Monte Tenrai', parent_region: 'Wa', is_custom: false },
    { name: 'Hoshizora y Bosque Hoshinomori', parent_region: 'Wa', is_custom: false },
    { name: 'Islas del Norte y Playa Furushumo', parent_region: 'Wa', is_custom: false },
    { name: 'Isla Shinkoku', parent_region: 'Kozakura', is_custom: false },
    { name: 'Isla Tenmei', parent_region: 'Kozakura', is_custom: false },
    { name: 'Cueva Msinato', parent_region: 'Kozakura', is_custom: false },
    { name: 'Ciudad de Masakado', parent_region: 'Kozakura', is_custom: false },
    { name: 'Otro', parent_region: null, is_custom: true },
  ]);

  await knex('hunter_ranks').insert([
    { name: 'Deshi', min_lv: 1, max_lv: 3 },
    { name: 'Heishi', min_lv: 4, max_lv: 6 },
    { name: 'Senshi', min_lv: 7, max_lv: 9 },
    { name: 'Ronin', min_lv: 10, max_lv: 12 },
    { name: 'Busho', min_lv: 13, max_lv: 15 },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reminders');
  await knex.schema.dropTableIfExists('summaries');
  await knex.schema.dropTableIfExists('waitlist');
  await knex.schema.dropTableIfExists('participants');
  await knex.schema.dropTableIfExists('missions');
  await knex.schema.dropTableIfExists('templates');
  await knex.schema.dropTableIfExists('hunter_ranks');
  await knex.schema.dropTableIfExists('regions');
  await knex.schema.dropTableIfExists('server_config');
}
