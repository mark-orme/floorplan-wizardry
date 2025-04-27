
export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  area?: number;
  objects?: any[];
  createdAt: Date;
  updatedAt: Date;
  isPublished?: boolean;
}

export interface FloorPlanMetadata {
  id: string;
  name: string;
  level: number;
  thumbnail?: string;
}
