
/**
 * Floor plan type definitions
 * @module types/floorPlanTypes
 */

/**
 * 2D point coordinate
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Stroke (drawing path) definition
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  /** Array of points that make up the stroke */
  points: Point[];
  /** Type of stroke (e.g., 'line', 'wall', etc.) */
  type: string;
  /** Stroke color */
  color: string;
  /** Stroke thickness */
  thickness: number;
}

/**
 * Wall definition for floor plans
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  /** Start point of the wall */
  start: Point;
  /** End point of the wall */
  end: Point;
  /** Wall thickness in pixels */
  thickness: number;
  /** Wall height in meters (optional) */
  height?: number;
}

/**
 * Room definition for floor plans
 */
export interface Room {
  /** Unique identifier */
  id: string;
  /** Room outline points */
  points: Point[];
  /** Room name/label */
  name: string;
  /** Room area in square meters */
  area?: number;
  /** Room type */
  type?: string;
}

/**
 * Paper size options
 */
export type PaperSize = 'A4' | 'A3' | 'A2' | 'A1' | 'A0' | 'LETTER' | 'LEGAL' | 'TABLOID';

/**
 * Floor plan object
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Display label (often includes floor number) */
  label: string;
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
  /** Wall elements in the floor plan */
  walls?: Wall[];
  /** Room elements in the floor plan */
  rooms?: Room[];
  /** Stroke elements in the floor plan */
  strokes?: Stroke[];
  /** Canvas data for rendering */
  canvasData?: any;
  /** Update timestamp */
  updatedAt?: number;
  /** Floor level */
  level?: number;
}
