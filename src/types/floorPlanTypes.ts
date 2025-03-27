
/**
 * Floor Plan type definitions
 * @module floorPlanTypes
 */

/**
 * Floor Plan interface
 * Represents a single floor plan with identifying information and data
 * @interface FloorPlan
 */
export interface FloorPlan {
  /** Unique identifier for the floor plan */
  id: string;
  /** Display name of the floor plan */
  name: string;
  /** Serialized canvas data or null if none exists */
  canvasData: any | null;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}
