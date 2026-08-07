export interface CreateMissionInput {
  title: string;
  description: string;
  imageUrl?: string;
  difficulty?: 'Baja' | 'Media' | 'Alta' | 'Extrema';
  requiredRankId?: number;
  ratings?: { lang: number; violence: number; sexual: number };
  categories?: string[];
  platforms?: string[];
  regionId?: number;
  regionCustom?: string;
  slotsMin: number;
  slotsMax: number;
  scheduledAt?: Date;
  extraNotes?: string;
  templateId?: number;
}
