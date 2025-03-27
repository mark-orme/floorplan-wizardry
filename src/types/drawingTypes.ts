/**
 * Drawing state type definitions
 * @module drawingTypes
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
 * Stroke type representing a sequence of points
 * @typedef {Point[]} Stroke
 */
export type Stroke = Point[];

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
 * Canvas dimensions interface
 * @interface CanvasDimensions
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Drawing state interface - represents the current state of drawing
 * @interface DrawingState
 */
export interface DrawingState {
  /** Whether drawing is currently active */
  isDrawing: boolean;
  /** Starting point of current drawing */
  startPoint: Point | null;
  /** Current point during drawing */
  currentPoint: Point | null;
  /** Current cursor position for tooltips */
  cursorPosition: Point | null;
  /** Middle point of the line for tooltip placement */
  midPoint: Point | null;
  /** Whether selection is currently active */
  selectionActive: boolean;
  /** Current zoom level of the canvas */
  currentZoom?: number;
}

/**
 * Grid creation callback type
 */
export type GridCreationCallback = (canvas: any) => any[];

/**
 * Grid creation state type
 */
export interface GridCreationState {
  /** Whether grid creation is in progress */
  isCreating: boolean;
  /** Number of creation attempts */
  attempts: number; 
  /** Whether creation was successful */
  success: boolean;
  /** Error message if creation failed */
  error?: string;
  /** Whether creation is currently in progress */
  creationInProgress?: boolean;
  /** Number of consecutive reset attempts */
  consecutiveResets?: number;
  /** Maximum allowed consecutive resets */
  maxConsecutiveResets?: number;
  /** Timestamp of last attempt */
  lastAttemptTime?: number;
  /** Timestamp of last successful creation */
  lastCreationTime?: number;
  /** Minimum interval between creation attempts */
  throttleInterval?: number;
  /** Whether grid already exists */
  exists?: boolean;
  /** Timeout ID for safety mechanism */
  safetyTimeout?: number | null;
  /** Total number of grid creations */
  totalCreations?: number;
  /** Maximum allowed recreations */
  maxRecreations?: number;
  /** Minimum interval between recreations */
  minRecreationInterval?: number;
  /** Last known canvas dimensions */
  lastDimensions?: { width: number; height: number };
  /** Creation lock mechanism */
  creationLock?: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  };
}

// Re-export DebugInfoState from debugTypes
export type { DebugInfoState } from './debugTypes';

// Export FloorPlan correctly with export type
export type { FloorPlan } from './floorPlanTypes';
