
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
  objects?: Record<string, any>;
  json?: string;
  strokes?: Stroke[];
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
