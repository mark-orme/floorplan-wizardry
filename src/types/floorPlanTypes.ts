
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

// Re-export for backward compatibility
export { FloorPlanMetadata } from './canvas-types';
