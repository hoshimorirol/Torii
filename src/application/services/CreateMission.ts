import { Mission, MissionData } from '../../core/entities/Mission';
import { MissionStatus } from '../../core/value-objects/MissionStatus';
import { MissionCode } from '../../core/value-objects/MissionCode';
import { MissionRepository } from '../ports/MissionRepository';
import { CreateMissionInput } from '../dto/CreateMissionInput';

export class CreateMission {
  constructor(private repository: MissionRepository) {}

  async execute(input: CreateMissionInput, senseiId: string): Promise<Mission> {
    const year = new Date().getFullYear();
    const sequence = await this.repository.getNextSequence(year);
    const code = MissionCode.generate(year, sequence);

    const missionData: MissionData = {
      code,
      title: input.title,
      status: MissionStatus.BORRADOR,
      senseiId,
      description: input.description,
      imageUrl: input.imageUrl || null,
      difficulty: input.difficulty || null,
      requiredRankId: input.requiredRankId || null,
      ratingsLang: input.ratings?.lang || 0,
      ratingsViolence: input.ratings?.violence || 0,
      ratingsSexual: input.ratings?.sexual || 0,
      categories: input.categories ? JSON.stringify(input.categories) : null,
      platforms: input.platforms ? JSON.stringify(input.platforms) : null,
      regionId: input.regionId || null,
      regionCustom: input.regionCustom || null,
      slotsMin: input.slotsMin,
      slotsMax: input.slotsMax,
      scheduledAt: input.scheduledAt || null,
      extraNotes: input.extraNotes || null,
    };

    const mission = new Mission(missionData);
    return this.repository.create(mission);
  }
}