
export interface FloorPlan {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  canvasData?: string;
}

export interface FloorPlanMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}
