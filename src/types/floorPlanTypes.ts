
/**
 * Floor plan type definitions
 * @module types/floorPlanTypes
 */

/**
 * Floor plan object
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Index/position in the floor list */
  index: number;
  /** Data URL for thumbnail image */
  thumbnail?: string;
  /** JSON representation of the floor plan state */
  state?: Record<string, any>;
  /** Last modified timestamp */
  lastModified?: number;
  /** Creation timestamp */
  createdAt?: number;
  /** Whether this floor is active */
  isActive?: boolean;
  /** Gross internal area in square meters */
  gia?: number;
}
