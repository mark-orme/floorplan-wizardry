
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
  /** Room properties */
  properties?: Record<string, any>;
}

/**
 * Stroke in a drawing
 */
export interface Stroke {
  /** Points making up the stroke */
  points: Point[];
  /** Stroke color */
  color: string;
  /** Stroke width */
  width: number;
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
  /** Floor plan walls */
  walls?: Wall[];
  /** Floor plan rooms */
  rooms?: Room[];
  /** Floor plan metadata */
  metadata: FloorPlanMetadata;
  /** Floor plan index */
  index: number;
  /** Serialized canvas JSON */
  canvasJson?: string;
  /** Free-form strokes */
  strokes?: Stroke[];
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
    walls: [],
    rooms: [],
    metadata: createDefaultMetadata(),
    index,
    strokes: []
  };
};
