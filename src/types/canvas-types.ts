import { fabric } from 'fabric';

export interface ExtendedFabricCanvas extends fabric.Canvas {
  wrapperEl: HTMLDivElement;
  // Add any other missing properties here
}

export const asExtendedCanvas = (canvas: fabric.Canvas): ExtendedFabricCanvas => {
  return canvas as ExtendedFabricCanvas;
};

// Add PropertyStatus if needed
export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Add FloorPlanMetadata export
export interface FloorPlanMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}
