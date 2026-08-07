import { MissionStatus, canTransition } from '../value-objects/MissionStatus';
import { DomainError } from '../errors/DomainError';

export interface MissionData {
  id?: number;
  code: string;
  title: string;
  status: MissionStatus | string;
  senseiId: string;
  description: string;
  imageUrl?: string | null;
  difficulty?: string | null;
  requiredRankId?: number | null;
  ratingsLang?: number;
  ratingsViolence?: number;
  ratingsSexual?: number;
  categories?: string | null;
  platforms?: string | null;
  regionId?: number | null;
  regionCustom?: string | null;
  slotsMin: number;
  slotsMax: number;
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  startedAt?: Date | null;
  closedAt?: Date | null;
  discordMessageId?: string | null;
  discordThreadId?: string | null;
  extraNotes?: string | null;
  tags?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Mission {
  private _data: MissionData;

  constructor(data: MissionData) {
    if (!data.title || data.title.trim().length === 0) {
      throw new DomainError('El titulo es obligatorio');
    }
    if (!data.description || data.description.trim().length === 0) {
      throw new DomainError('La descripcion es obligatoria');
    }
    if (data.slotsMin < 1 || data.slotsMin > 20) {
      throw new DomainError('Plazas minimas entre 1 y 20');
    }
    if (data.slotsMax < data.slotsMin || data.slotsMax > 20) {
      throw new DomainError('Plazas maximas deben ser >= minimas y <= 20');
    }
    this._data = data;
  }

  get id() { return this._data.id; }
  get code() { return this._data.code; }
  get title() { return this._data.title; }
  get status() { return this._data.status as string; }
  get senseiId() { return this._data.senseiId; }
  get description() { return this._data.description; }
  get imageUrl() { return this._data.imageUrl ?? null; }
  get difficulty() { return this._data.difficulty ?? null; }
  get requiredRankId() { return this._data.requiredRankId ?? null; }
  get ratingsLang() { return this._data.ratingsLang ?? 0; }
  get ratingsViolence() { return this._data.ratingsViolence ?? 0; }
  get ratingsSexual() { return this._data.ratingsSexual ?? 0; }
  get categories() { return this._data.categories; }
  get platforms() { return this._data.platforms; }
  get regionId() { return this._data.regionId ?? null; }
  get regionCustom() { return this._data.regionCustom ?? null; }
  get slotsMin() { return this._data.slotsMin; }
  get slotsMax() { return this._data.slotsMax; }
  get scheduledAt() { return this._data.scheduledAt ?? null; }
  get publishedAt() { return this._data.publishedAt ?? null; }
  get startedAt() { return this._data.startedAt ?? null; }
  get closedAt() { return this._data.closedAt ?? null; }
  get discordMessageId() { return this._data.discordMessageId ?? null; }
  get discordThreadId() { return this._data.discordThreadId ?? null; }
  get extraNotes() { return this._data.extraNotes ?? null; }
  get tags() { return this._data.tags; }
  get createdAt() { return this._data.createdAt; }
  get updatedAt() { return this._data.updatedAt; }

  private transitionTo(newStatus: MissionStatus): void {
    const current = this._data.status as string;
    if (!canTransition(current, newStatus)) {
      throw new DomainError(`Transicion invalida de ${current} a ${newStatus}`);
    }
    this._data.status = newStatus;
    this._data.updatedAt = new Date();
  }

  publish(): void {
    this.transitionTo(MissionStatus.PUBLICADA);
    this._data.publishedAt = new Date();
  }

  openEnrollment(): void {
    this.transitionTo(MissionStatus.INSCRIPCION_ABIERTA);
  }

  closeEnrollment(): void {
    this.transitionTo(MissionStatus.COMPLETA);
  }

  start(): void {
    this.transitionTo(MissionStatus.EN_CURSO);
    this._data.startedAt = new Date();
  }

  complete(): void {
    this.transitionTo(MissionStatus.FINALIZADA);
    this._data.closedAt = new Date();
  }

  archive(): void {
    this.transitionTo(MissionStatus.ARCHIVADA);
  }

  cancel(): void {
    this.transitionTo(MissionStatus.CANCELADA);
  }

  reopen(): void {
    this._data.status = MissionStatus.BORRADOR;
    this._data.updatedAt = new Date();
  }

  toData(): MissionData {
    return { ...this._data };
  }

  static reconstitute(data: MissionData): Mission {
    return new Mission(data);
  }
}
