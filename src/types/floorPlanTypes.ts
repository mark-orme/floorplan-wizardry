
/**
 * Floor Plan Types
 * Type definitions for floor plans and related entities
 * @module types/floorPlanTypes
 */
import { Point } from './core/Point';

/**
 * Paper size enum for printing
 */
export enum PaperSize {
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  Letter = "Letter",
  Legal = "Legal",
  Tabloid = "Tabloid",
  Custom = "Custom"
}

/**
 * Stroke type literal for drawing types
 */
export type StrokeTypeLiteral = 'line' | 'polyline' | 'wall' | 'room' | 'freehand';

/**
 * Stroke type (same as StrokeTypeLiteral for backward compatibility)
 */
export type StrokeType = StrokeTypeLiteral;

/**
 * Room type literal
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Wall interface for floor plan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Points array (start and end) */
  points: Point[];
  
  /** Start point (alias for points[0]) */
  startPoint?: Point;
  
  /** End point (alias for points[1]) */
  endPoint?: Point;
  
  /** Start point (required) */
  start: Point;
  
  /** End point (required) */
  end: Point;
  
  /** Wall thickness */
  thickness: number;
  
  /** Wall height (optional) */
  height?: number;
  
  /** Wall color */
  color: string;
  
  /** Room IDs connected to this wall */
  roomIds?: string[];
}

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room area in square meters (required) */
  area: number;
  
  /** Room boundary points */
  points: Point[];
  
  /** Room color (required) */
  color: string;
  
  /** Floor level this room belongs to */
  level: number;
}

/**
 * Stroke interface for annotations
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Stroke points */
  points: Point[];
  
  /** Stroke type */
  type: StrokeTypeLiteral;
  
  /** Stroke color */
  color: string;
  
  /** Stroke thickness */
  thickness: number;
  
  /** Stroke width (same as thickness for compatibility) */
  width?: number;
}

/**
 * FloorPlan metadata interface
 */
export interface FloorPlanMetadata {
  /** Date when the floor plan was created */
  createdAt: string;
  
  /** Date when the floor plan was last updated */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;
}

/**
 * FloorPlan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label: string;
  
  /** Walls array */
  walls: Wall[];
  
  /** Rooms array */
  rooms: Room[];
  
  /** Strokes array */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData: string | null;
  
  /** Canvas JSON serialization (required) */
  canvasJson: string | null;
  
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area in square meters */
  gia: number;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Floor index (same as level for compatibility) */
  index: number;
  
  /** Floor plan metadata */
  metadata: FloorPlanMetadata;
}

/**
 * Create a default floor plan
 * @param {number} index Floor index
 * @returns {FloorPlan} Default floor plan
 */
export const createDefaultFloorPlan = (index: number = 0): FloorPlan => {
  const now = new Date().toISOString();
  const name = `Floor ${index + 1}`;
  
  return {
    id: `floor-${Date.now()}-${index}`,
    name,
    label: name,
    gia: 0,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    level: index,
    index,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: index
    }
  };
};
