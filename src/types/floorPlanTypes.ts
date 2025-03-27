
/**
 * Floor Plan type definitions
 * @module floorPlanTypes
 */
import type { Point, Stroke } from './drawingTypes';

// These are defined in drawingTypes.ts, so just importing them here
export type { Wall, Room, PaperSize } from './drawingTypes';
export type { Point, Stroke };

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
  /** Label for display (backwards compatibility) */
  label?: string;
  /** Array of walls in the floor plan */
  walls?: Wall[];
  /** Array of rooms in the floor plan */
  rooms?: Room[];
  /** Array of strokes (sequence of points) */
  strokes?: Stroke[];
  /** Gross Internal Area in square meters */
  gia?: number;
  /** Floor level number */
  level?: number;
  /** Scale factor */
  scale?: number;
  /** Serialized canvas data or null if none exists */
  canvasData: any | null;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Additional metadata */
  meta?: {
    [key: string]: any;
  };
  /** Areas calculated for different parts of the floor plan */
  areas?: number[];
}

/**
 * Storage model for IndexedDB
 * @interface FloorPlanStorageModel
 */
export interface FloorPlanStorageModel {
  /** Unique identifier */
  id: string;
  /** Array of floor plans */
  data: FloorPlan[];
}
