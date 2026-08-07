import { Mission, MissionData } from '../../../core/entities/Mission';
import { MissionStatus } from '../../../core/value-objects/MissionStatus';
import { MissionRepository } from '../../../application/ports/MissionRepository';
import { db } from '../connection';

interface MissionRow {
  id: number;
  code: string;
  title: string;
  description: string;
  image_url: string | null;
  status: string;
  sensei_id: string;
  difficulty: string | null;
  required_rank_id: number | null;
  ratings_lang: number | null;
  ratings_violence: number | null;
  ratings_sexual: number | null;
  categories: string | null;
  platforms: string | null;
  region_id: number | null;
  region_custom: string | null;
  slots_min: number;
  slots_max: number;
  scheduled_at: string | null;
  published_at: string | null;
  started_at: string | null;
  closed_at: string | null;
  discord_message_id: string | null;
  discord_thread_id: string | null;
  extra_notes: string | null;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export class SqliteMissionRepository implements MissionRepository {
  private rowToEntity(row: MissionRow): Mission {
    const data: MissionData = {
      id: row.id,
      code: row.code,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      status: row.status as MissionStatus,
      senseiId: row.sensei_id,
      difficulty: row.difficulty,
      requiredRankId: row.required_rank_id,
      ratingsLang: row.ratings_lang ?? 0,
      ratingsViolence: row.ratings_violence ?? 0,
      ratingsSexual: row.ratings_sexual ?? 0,
      categories: row.categories,
      platforms: row.platforms,
      regionId: row.region_id,
      regionCustom: row.region_custom,
      slotsMin: row.slots_min,
      slotsMax: row.slots_max,
      scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : null,
      publishedAt: row.published_at ? new Date(row.published_at) : null,
      startedAt: row.started_at ? new Date(row.started_at) : null,
      closedAt: row.closed_at ? new Date(row.closed_at) : null,
      discordMessageId: row.discord_message_id,
      discordThreadId: row.discord_thread_id,
      extraNotes: row.extra_notes,
      tags: row.tags,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
    return Mission.reconstitute(data);
  }

  private entityToRow(mission: Mission): any {
    return {
      code: mission.code,
      title: mission.title,
      description: mission.description,
      image_url: mission.imageUrl,
      status: mission.status,
      sensei_id: mission.senseiId,
      difficulty: mission.difficulty,
      required_rank_id: mission.requiredRankId,
      ratings_lang: mission.ratingsLang,
      ratings_violence: mission.ratingsViolence,
      ratings_sexual: mission.ratingsSexual,
      categories: mission.categories,
      platforms: mission.platforms,
      region_id: mission.regionId,
      region_custom: mission.regionCustom,
      slots_min: mission.slotsMin,
      slots_max: mission.slotsMax,
      scheduled_at: mission.scheduledAt?.toISOString() ?? null,
      published_at: mission.publishedAt?.toISOString() ?? null,
      started_at: mission.startedAt?.toISOString() ?? null,
      closed_at: mission.closedAt?.toISOString() ?? null,
      discord_message_id: mission.discordMessageId,
      discord_thread_id: mission.discordThreadId,
      extra_notes: mission.extraNotes,
      tags: mission.tags,
    };
  }

  async create(mission: Mission): Promise<Mission> {
    const row = this.entityToRow(mission);
    const [id] = await db('missions').insert(row);
    const saved = await db('missions').where('id', id).first();
    return this.rowToEntity(saved);
  }

  async findById(id: number): Promise<Mission | null> {
    const row = await db('missions').where('id', id).first();
    if (!row) return null;
    return this.rowToEntity(row);
  }

  async findByCode(code: string): Promise<Mission | null> {
    const row = await db('missions').where('code', code).first();
    if (!row) return null;
    return this.rowToEntity(row);
  }

  async findBySensei(senseiId: string, status?: string[]): Promise<Mission[]> {
    let query = db('missions').where('sensei_id', senseiId);
    if (status && status.length > 0) {
      query = query.whereIn('status', status);
    }
    const rows = await query.orderBy('created_at', 'desc');
    return rows.map((r: MissionRow) => this.rowToEntity(r));
  }

  async update(mission: Mission): Promise<Mission> {
    const id = mission.id;
    if (!id) throw new Error('Cannot update mission without id');

    const row = this.entityToRow(mission);
    await db('missions').where('id', id).update({
      ...row,
      updated_at: new Date().toISOString(),
    });

    const updated = await db('missions').where('id', id).first();
    return this.rowToEntity(updated);
  }

  async delete(id: number): Promise<void> {
    await db('missions').where('id', id).delete();
  }

  async getNextSequence(year: number): Promise<number> {
    const prefix = `EXP-${year}-`;
    const result = await db('missions')
      .where('code', 'like', `${prefix}%`)
      .max<{ maxId: number | null }>('id as maxId')
      .first();
    return (result?.maxId ?? 0) + 1;
  }
}
