
/**
 * Floor plan type definitions
 * @module floorPlanTypes
 */
import { Point } from './geometryTypes';
import { 
  FloorPlan as CoreFloorPlan, 
  Wall as CoreWall, 
  Stroke as CoreStroke, 
  Room as CoreRoom, 
  FloorPlanMetadata as CoreFloorPlanMetadata,
  StrokeType as CoreStrokeType
} from './core/FloorPlan';

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
export interface Wall extends CoreWall {
  /** Start point of the wall - maps to 'start' in CoreWall */
  startPoint: Point;
  /** End point of the wall - maps to 'end' in CoreWall */
  endPoint: Point;
}

/**
 * Room definition
 * Represents a room in a floor plan
 */
export interface Room extends CoreRoom {
  /** Room level */
  level?: number;
}

/**
 * Stroke definition
 * Represents a drawing stroke on the canvas
 */
export interface Stroke extends Omit<CoreStroke, 'type' | 'width'> {
  /** Type of stroke */
  type: StrokeType | StrokeTypeLiteral;
  /** Stroke width in pixels (equivalent to thickness for API compatibility) */
  width?: number; // Changed to optional to match core
}

/**
 * Floor plan metadata
 * Contains additional information about a floor plan
 */
export interface FloorPlanMetadata extends Omit<CoreFloorPlanMetadata, 'createdAt' | 'updatedAt'> {
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
export interface FloorPlan extends Omit<CoreFloorPlan, 'walls' | 'rooms' | 'strokes' | 'metadata' | 'canvasData'> {
  /** Floor plan display label - now required to match core FloorPlan */
  label: string;
  /** Array of drawing strokes */
  strokes: Stroke[];
  /** Array of walls */
  walls: Wall[];
  /** Array of rooms */
  rooms: Room[];
  /** Floor plan metadata */
  metadata: FloorPlanMetadata;
  /** Serialized canvas state */
  canvasJson?: string;
  /** Gross internal area in square meters */
  gia: number;
  /** Canvas data for storage */
  canvasData: any;
  /** Floor level */
  level: number;
  /** Paper size */
  paperSize?: string | PaperSize;
}

// Use export type for isolatedModules compatibility
export type { Point } from './geometryTypes';
