
import { Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas, ExtendedFabricObject as EFO } from './ExtendedFabricCanvas';

/**
 * Extended Fabric Object with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  set: (options: Record<string, any>) => FabricObject;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
}

/**
 * Re-export ExtendedFabricCanvas for consistency
 */
export type { ExtendedFabricCanvas } from './ExtendedFabricCanvas';

/**
 * Helper to cast a standard Canvas to our extended type
 */
export const asExtendedCanvas = (canvas: any): ExtendedFabricCanvas => {
  return canvas as ExtendedFabricCanvas;
};

export enum PropertyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed'
}

export type FloorPlanMetadata = {
  id: string;
  name: string;
  created: string;
  modified: string;
  status: PropertyStatus;
};
