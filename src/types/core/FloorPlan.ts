
/**
 * Floor plan type definitions
 * @module core/FloorPlan
 */

/**
 * Floor interface
 */
export interface Floor {
  id: string;
  name: string;
  level: number;
}

/**
 * Floor options interface
 */
export interface FloorOptions {
  id?: string;
  name?: string;
  level?: number;
}

/**
 * Floor metadata interface
 */
export interface FloorMetadata {
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

/**
 * Floor plan interface
 */
export interface FloorPlan extends Floor, FloorMetadata {
  id: string;
  name: string;
  level: number;
  /** Gross Internal Area in square meters */
  gia: number;
  /** Label for the floor plan (optional) */
  label?: string;
  /** Collection of objects in the floor plan */
  objects?: Record<string, any>;
  /** Serialized JSON representation */
  json?: string;
  /** Array of strokes/paths */
  strokes?: Stroke[];
  /** Collection of walls */
  walls?: Wall[];
  /** Collection of rooms */
  rooms?: Room[];
  /** Serialized canvas data */
  canvasData?: string | null;
}

/**
 * Paper size interface
 */
export interface PaperSize {
  width: number;
  height: number;
  name: string;
}

/**
 * Stroke interface
 */
export interface Stroke {
  id: string;
  points: { x: number; y: number }[];
  type: string;
  color: string;
  thickness: number;
}

/**
 * Wall interface
 */
export interface Wall {
  id: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  thickness: number;
  height?: number;
  color?: string;
  type?: string;
}

/**
 * Room interface
 */
export interface Room {
  id: string;
  points: { x: number; y: number }[];
  name?: string;
  area?: number;
  color?: string;
  type?: string;
}

/**
 * Create a new floor plan with default values
 * @param {string} id - Floor plan ID
 * @param {string} name - Floor plan name
 * @param {number} level - Floor level
 * @returns {FloorPlan} A new floor plan
 */
export function createFloorPlan(id: string, name: string, level: number): FloorPlan {
  return {
    id,
    name,
    level,
    gia: 0,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
