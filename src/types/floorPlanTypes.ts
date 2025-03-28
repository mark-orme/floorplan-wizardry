/**
 * Floor plan type definitions
 * @module floorPlanTypes
 */
import { Point } from './geometryTypes';
import { Wall as CoreWall } from './core/FloorPlan';

/**
 * Paper size enumeration
 * Standard paper sizes used in floor plans
 */
export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  CUSTOM = 'CUSTOM'
}

/**
 * Stroke type enumeration
 * Types of strokes that can be drawn
 */
export enum StrokeType {
  LINE = 'LINE',
  POLYLINE = 'POLYLINE',
  CIRCLE = 'CIRCLE',
  RECTANGLE = 'RECTANGLE',
  TEXT = 'TEXT',
  PATH = 'PATH',
  WALL = 'WALL',
  ROOM = 'ROOM',
  FREEHAND = 'FREEHAND'
}

// String literal type for compatibility with core StrokeType
export type StrokeTypeLiteral = 'line' | 'polyline' | 'wall' | 'room' | 'freehand';

/**
 * Wall definition
 * Represents a wall in a floor plan
 * Compatible with CoreWall from core/FloorPlan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  /** Start point of the wall - maps to 'start' in CoreWall */
  startPoint: Point;
  /** End point of the wall - maps to 'end' in CoreWall */
  endPoint: Point;
  /** Wall thickness in mm */
  thickness: number;
  /** Wall height in mm */
  height?: number;
  /** Wall color */
  color?: string;
  /** Associated room IDs */
  roomIds?: string[];
  /** Start point for CoreWall compatibility */
  start?: Point;
  /** End point for CoreWall compatibility */
  end?: Point;
}

/**
 * Room definition
 * Represents a room in a floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  /** Room name */
  name: string;
  /** Room type */
  type?: string;
  /** Points defining the room boundary */
  points: Point[];
  /** Room color */
  color?: string;
  /** Floor level */
  level?: number;
  /** Room area in square meters */
  area?: number;
}

/**
 * Stroke definition
 * Represents a drawing stroke on the canvas
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  /** Array of points defining the stroke */
  points: Point[];
  /** Type of stroke */
  type: StrokeType | StrokeTypeLiteral;
  /** Stroke color */
  color: string;
  /** Stroke thickness in pixels */
  thickness: number;
  /** Stroke width in pixels (equivalent to thickness for API compatibility) */
  width: number;
}

/**
 * Floor plan metadata
 * Contains additional information about a floor plan
 */
export interface FloorPlanMetadata {
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Paper size */
  paperSize: PaperSize | string;
  /** Floor level */
  level: number;
}

/**
 * Floor plan definition
 * Represents a complete floor plan with all its elements
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  /** Floor plan name */
  name: string;
  /** Floor plan display label - now required to match core FloorPlan */
  label: string;
  /** Array of drawing strokes */
  strokes: Stroke[];
  /** Array of walls */
  walls?: Wall[];
  /** Array of rooms */
  rooms?: Room[];
  /** Floor plan metadata */
  metadata?: FloorPlanMetadata;
  /** Floor index for multi-story buildings */
  index: number;
  /** Serialized canvas state */
  canvasJson?: string;
  /** Gross internal area in square meters */
  gia?: number;
  /** Canvas data for storage */
  canvasData?: any;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
  /** Floor level */
  level?: number;
  /** Paper size */
  paperSize?: string | PaperSize;
}

// Use export type for isolatedModules compatibility
export type { Point } from './geometryTypes';
