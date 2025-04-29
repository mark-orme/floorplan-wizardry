
import { FloorPlanMetadata } from './canvas-types';

export interface FloorPlan {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  data?: any;
  thumbnail?: string;
  metadata: FloorPlanMetadata;
  label?: string;
}

// Property status enum for properties
export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  PENDING = 'pending',
  RESERVED = 'reserved',
  UNDER_CONSTRUCTION = 'under_construction'
}

// Re-export for backward compatibility
export { FloorPlanMetadata } from './canvas-types';
