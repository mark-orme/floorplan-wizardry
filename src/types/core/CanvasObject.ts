
/**
 * Canvas object type definitions
 * Provides type safety for fabric object operations
 */

import { Object as FabricObject, Line, Rect, Circle, Path, Group, IText } from 'fabric';

/**
 * Common properties for all canvas objects
 */
export interface CanvasObjectCommon {
  /** Unique identifier */
  id: string;
  /** Object type */
  type: string;
  /** Whether the object is selected */
  selected?: boolean;
  /** Whether the object is locked */
  locked?: boolean;
  /** Layer index */
  zIndex?: number;
  /** Object metadata */
  metadata?: Record<string, any>;
  /** Custom class for the object */
  customClass?: string;
}

/**
 * Wall object interface
 */
export interface WallObject extends CanvasObjectCommon {
  /** Wall type */
  type: 'wall';
  /** Wall thickness */
  thickness: number;
  /** Wall height */
  height?: number;
  /** Wall start point */
  start: { x: number; y: number };
  /** Wall end point */
  end: { x: number; y: number };
  /** Connected walls */
  connections?: string[];
}

/**
 * Room object interface
 */
export interface RoomObject extends CanvasObjectCommon {
  /** Room type */
  type: 'room';
  /** Room name */
  name: string;
  /** Room area */
  area?: number;
  /** Room perimeter points */
  points: Array<{ x: number; y: number }>;
  /** Room properties */
  properties?: Record<string, any>;
}

/**
 * Dimension object interface
 */
export interface DimensionObject extends CanvasObjectCommon {
  /** Dimension type */
  type: 'dimension';
  /** Measurement value */
  value: number;
  /** Measurement unit */
  unit: 'mm' | 'cm' | 'm' | 'in' | 'ft';
  /** Start point */
  start: { x: number; y: number };
  /** End point */
  end: { x: number; y: number };
  /** Offset from the measured line */
  offset?: number;
}

/**
 * Grid object interface
 */
export interface GridObject extends CanvasObjectCommon {
  /** Grid type */
  type: 'grid';
  /** Cell size */
  cellSize: number;
  /** Major line interval */
  majorLineInterval: number;
  /** Grid color */
  gridColor: string;
  /** Major line color */
  majorLineColor: string;
  /** Show grid flag */
  showGrid: boolean;
}

/**
 * Type mapping from string types to fabric object types
 */
export interface FabricObjectTypeMap {
  line: Line;
  rect: Rect;
  circle: Circle;
  path: Path;
  group: Group;
  text: IText;
  wall: FabricObject;
  room: FabricObject;
  dimension: FabricObject;
  grid: FabricObject;
}

/**
 * Union type of all canvas object types
 */
export type CanvasObject = 
  | WallObject
  | RoomObject
  | DimensionObject
  | GridObject;

/**
 * Canvas object creation options
 */
export interface ObjectCreationOptions {
  /** Object position */
  position?: { x: number; y: number };
  /** Object dimensions */
  dimensions?: { width?: number; height?: number; radius?: number };
  /** Object style properties */
  style?: {
    /** Fill color */
    fill?: string;
    /** Stroke color */
    stroke?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Object opacity */
    opacity?: number;
  };
  /** Whether the object should be selectable */
  selectable?: boolean;
  /** Whether the object should have controls */
  hasControls?: boolean;
  /** Whether the object should be locked */
  locked?: boolean;
  /** Custom metadata */
  metadata?: Record<string, any>;
}
