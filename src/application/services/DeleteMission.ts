import { MissionRepository } from '../ports/MissionRepository';
import { MissionStatus } from '../../core/value-objects/MissionStatus';

export class DeleteMission {
  constructor(private repository: MissionRepository) {}

  async execute(missionId: number, senseiId: string): Promise<void> {
    const mission = await this.repository.findById(missionId);
    if (!mission) {
      throw new Error('Expediente no encontrado');
    }
    if (mission.senseiId !== senseiId) {
      throw new Error('No tienes permiso para eliminar este expediente');
    }
    if (mission.status !== MissionStatus.BORRADOR) {
      throw new Error('Solo se pueden eliminar expedientes en borrador');
    }
    await this.repository.delete(missionId);
  }
}