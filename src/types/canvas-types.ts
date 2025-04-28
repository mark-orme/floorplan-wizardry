
import { Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from './ExtendedFabricCanvas';

// Re-export ExtendedFabricCanvas
export { ExtendedFabricCanvas, asExtendedCanvas } from './ExtendedFabricCanvas';

// Define ExtendedFabricObject type
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  objectType?: string;
  set?: (key: string | Record<string, any>, value?: any) => FabricObject;
}

// Define property status enum
export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

// Define FloorPlanMetadata type
export interface FloorPlanMetadata {
  name: string;
  description?: string;
  level?: number;
  updatedAt: number | string;
  createdAt?: number | string;
}
