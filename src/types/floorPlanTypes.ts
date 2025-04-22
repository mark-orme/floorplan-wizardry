
/**
 * Legacy Floor Plan Types 
 * This is kept for backward compatibility
 * @module types/floorPlanTypes
 * @deprecated Use the unified types from @/types/floor-plan/unifiedTypes instead
 */
import { Stroke } from './floor-plan/strokeTypes';
import { Room } from './floor-plan/roomTypes';
import { Wall } from './floor-plan/wallTypes';
import { FloorPlanMetadata } from './floor-plan/metadataTypes';

/**
 * Legacy FloorPlan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label?: string;
  
  /** Walls array */
  walls: Wall[];
  
  /** Rooms array */
  rooms: Room[];
  
  /** Strokes array */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData?: string | null;
  
  /** Canvas JSON serialization (optional) */
  canvasJson?: string | null;
  
  /** Creation date timestamp */
  createdAt?: string;
  
  /** Last update timestamp */
  updatedAt?: string;
  
  /** Gross internal area in square meters */
  gia?: number;
  
  /** Floor level (0 = ground floor) */
  level?: number;
  
  /** Floor index (same as level for compatibility) */
  index?: number;
  
  /** Floor plan metadata */
  metadata?: FloorPlanMetadata;
  
  /** Property ID (required) - references the property that contains this floor plan */
  propertyId: string;
  
  /** Additional data for the floor plan */
  data?: any;
  
  /** User ID who owns the floor plan */
  userId?: string;
  
  /** Canvas state for optimized rendering */
  canvasState?: any;
}

// Export FloorPlanMetadata for use in other modules
export type { FloorPlanMetadata };
