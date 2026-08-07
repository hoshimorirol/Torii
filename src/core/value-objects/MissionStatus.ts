export enum MissionStatus {
  BORRADOR = 'BORRADOR',
  PUBLICADA = 'PUBLICADA',
  INSCRIPCION_ABIERTA = 'INSCRIPCION_ABIERTA',
  COMPLETA = 'COMPLETA',
  EN_CURSO = 'EN_CURSO',
  FINALIZADA = 'FINALIZADA',
  ARCHIVADA = 'ARCHIVADA',
  CANCELADA = 'CANCELADA',
}

export const validTransitions: Record<string, string[]> = {
  [MissionStatus.BORRADOR]: [MissionStatus.PUBLICADA, MissionStatus.CANCELADA],
  [MissionStatus.PUBLICADA]: [MissionStatus.INSCRIPCION_ABIERTA, MissionStatus.BORRADOR],
  [MissionStatus.INSCRIPCION_ABIERTA]: [MissionStatus.COMPLETA, MissionStatus.PUBLICADA],
  [MissionStatus.COMPLETA]: [MissionStatus.EN_CURSO, MissionStatus.INSCRIPCION_ABIERTA],
  [MissionStatus.EN_CURSO]: [MissionStatus.FINALIZADA],
  [MissionStatus.FINALIZADA]: [MissionStatus.ARCHIVADA, MissionStatus.EN_CURSO],
  [MissionStatus.ARCHIVADA]: [],
  [MissionStatus.CANCELADA]: [],
};

export function canTransition(from: string, to: string): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}