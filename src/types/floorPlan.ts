
/**
 * Floor plan interface
 */
export interface FloorPlan {
  id: string;
  name: string;
  description?: string;
  canvasJson?: string;
  width: number;
  height: number;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  floorNumber?: number;
}
