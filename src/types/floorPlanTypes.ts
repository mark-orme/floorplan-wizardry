
/**
 * Floor plan related types
 * @module types/floorPlanTypes
 */
import { Point } from './geometryTypes';

/**
 * Paper size options
 */
export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  LETTER = 'Letter',
  LEGAL = 'Legal',
  TABLOID = 'Tabloid',
  CUSTOM = 'Custom'
}

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Paper size */
  paperSize: PaperSize;
  /** Floor level (e.g. 1, 2, -1) */
  level: number;
}

/**
 * Wall representation in floor plan
 */
export interface Wall {
  /** Wall ID */
  id: string;
  /** Start point */
  startPoint: Point;
  /** End point */
  endPoint: Point;
  /** Wall thickness in pixels */
  thickness: number;
  /** Wall height in meters */
  height?: number;
  /** Wall properties */
  properties?: Record<string, any>;
}

/**
 * Room representation in floor plan
 */
export interface Room {
  /** Room ID */
  id: string;
  /** Room name */
  name: string;
  /** Room type */
  type: string;
  /** Room points forming polygon */
  points: Point[];
  /** Room area in square meters */
  area?: number;
  /** Room properties */
  properties?: Record<string, any>;
}

/**
 * Stroke type enum
 */
export type StrokeType = 'line' | 'wall' | 'room' | 'freehand' | 'polyline';

/**
 * Stroke in a drawing
 */
export interface Stroke {
  /** Unique stroke ID */
  id?: string;
  /** Points making up the stroke */
  points: Point[];
  /** Stroke color */
  color: string;
  /** Stroke width (required for compatibility with tests and other components) */
  width: number;
  /** Stroke thickness (alias for width for compatibility) */
  thickness?: number;
  /** Stroke type */
  type?: StrokeType;
  /** Stroke properties */
  properties?: Record<string, any>;
}

/**
 * Floor plan interface
 */
export interface FloorPlan {
  /** Floor plan ID */
  id: string;
  /** Floor plan name */
  name: string;
  /** Floor plan display label */
  label?: string;
  /** Floor plan walls */
  walls?: Wall[];
  /** Floor plan rooms */
  rooms?: Room[];
  /** Floor plan metadata */
  metadata: FloorPlanMetadata;
  /** Floor plan index (required for backwards compatibility) */
  index: number;
  /** Serialized canvas JSON */
  canvasJson?: string;
  /** Alternative for canvasJson in some implementations */
  canvasData?: string | null;
  /** Free-form strokes */
  strokes: Stroke[];
  /** Gross internal area in square meters */
  gia?: number;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
  /** Floor level (synchronizes with metadata.level) */
  level?: number;
}

/**
 * Create default metadata
 */
export const createDefaultMetadata = (): FloorPlanMetadata => ({
  createdAt: Date.now(),
  updatedAt: Date.now(),
  paperSize: PaperSize.A3,
  level: 1
});

/**
 * Create a new floor plan with default values
 */
export const createFloorPlan = (id: string, name: string, index: number): FloorPlan => {
  return {
    id,
    name,
    label: name,
    walls: [],
    rooms: [],
    metadata: createDefaultMetadata(),
    index,
    strokes: []
  };
};

// Export Point type for other modules to use
export { Point };
