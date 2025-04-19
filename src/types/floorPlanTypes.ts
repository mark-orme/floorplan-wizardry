
/**
 * Floor Plan Types
 */

export interface FloorPlan {
  id: string;
  name: string;
  data: any; // Canvas JSON data
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlanMetadata {
  id: string;
  name: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlanDimensions {
  width: number;
  height: number;
  scale: number; // scale in pixels per meter
}

export interface AreaCalculation {
  areaM2: number; // Area in square meters
  areaSqFt: number; // Area in square feet
  rooms?: {
    id: string;
    name: string;
    areaM2: number;
  }[];
}

export enum FloorPlanStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}
