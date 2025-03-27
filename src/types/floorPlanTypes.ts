
/**
 * Floor Plan type definitions
 * @module floorPlanTypes
 */

/**
 * Point interface representing a 2D coordinate
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Stroke interface representing a drawing stroke
 * @interface Stroke
 */
export interface Stroke {
  /** Unique identifier for the stroke */
  id: string;
  /** Array of points that make up the stroke */
  points: Point[];
  /** Type of stroke */
  type: 'wall' | 'room' | 'line';
  /** Stroke color in hex format */
  color: string;
  /** Stroke thickness in pixels */
  thickness: number;
}

/**
 * Wall definition in a floor plan
 * @interface Wall
 */
export interface Wall {
  /** Unique identifier for the wall */
  id: string;
  /** Starting point of the wall */
  start: Point;
  /** Ending point of the wall */
  end: Point;
  /** Wall thickness in pixels */
  thickness?: number;
  /** Wall height in meters */
  height?: number;
  /** Type of wall */
  type?: 'interior' | 'exterior' | 'partition';
}

/**
 * Room definition in a floor plan
 * @interface Room
 */
export interface Room {
  /** Unique identifier for the room */
  id: string;
  /** Room name */
  name: string;
  /** Room bounds */
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Room area in square meters */
  area?: number;
  /** Room type */
  type?: string;
}

/**
 * Paper size for printing
 * @type {PaperSize}
 */
export type PaperSize = 'A4' | 'A3' | 'infinite';

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
  /** Label for display */
  label: string;
  /** Array of walls in the floor plan */
  walls: Wall[];
  /** Array of rooms in the floor plan */
  rooms: Room[];
  /** Array of strokes (drawing elements) */
  strokes: Stroke[];
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
