export interface SummaryData {
  id?: number;
  missionId: number;
  narrativeSummary: string;
  consequences?: string | null;
  rewards?: string | null;
  additionalNotes?: string | null;
  attachments?: string | null;
  writtenBy: string;
  closedAt?: Date;
}

export class Summary {
  constructor(private data: SummaryData) {}

  get missionId() { return this.data.missionId; }
  get narrativeSummary() { return this.data.narrativeSummary; }
}