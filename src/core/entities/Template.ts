export interface TemplateData {
  id?: number;
  name: string;
  descriptionBase: string;
  imageUrl?: string | null;
  difficulty?: string | null;
  requiredRankId?: number | null;
  ratingsLang?: number;
  ratingsViolence?: number;
  ratingsSexual?: number;
  categories?: string | null;
  platforms?: string | null;
  slotsMin?: number;
  slotsMax?: number;
  defaultRegionId?: number | null;
  extraNotes?: string | null;
  createdBy: string;
  createdAt?: Date;
}

export class Template {
  constructor(private data: TemplateData) {}

  get id() { return this.data.id; }
  get name() { return this.data.name; }
  get descriptionBase() { return this.data.descriptionBase; }
}
