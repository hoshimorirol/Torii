export interface ParticipantData {
  id?: number;
  missionId: number;
  userId: string;
  characterName?: string | null;
  hunterRankAtEnrollment?: string | null;
  status: string;
  notesSensei?: string | null;
  enrolledAt?: Date;
}

export class Participant {
  constructor(private data: ParticipantData) {}

  get id() { return this.data.id; }
  get missionId() { return this.data.missionId; }
  get userId() { return this.data.userId; }
  get characterName() { return this.data.characterName; }
  get status() { return this.data.status; }
}