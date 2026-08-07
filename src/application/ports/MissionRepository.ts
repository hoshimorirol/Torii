import { Mission } from '../../core/entities/Mission';

export interface MissionRepository {
  create(mission: Mission): Promise<Mission>;
  findByCode(code: string): Promise<Mission | null>;
  findById(id: number): Promise<Mission | null>;
  findBySensei(senseiId: string, status?: string[]): Promise<Mission[]>;
  update(mission: Mission): Promise<Mission>;
  delete(id: number): Promise<void>;
  getNextSequence(year: number): Promise<number>;
}
