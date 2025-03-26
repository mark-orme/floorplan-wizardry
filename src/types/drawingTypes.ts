
/**
 * Drawing state type definitions
 * @module drawingTypes
 */
export interface Point {
  x: number;
  y: number;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Floor plan structure for storing drawing data
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  strokes: Point[][];
  areas?: number[];
  rooms?: string[];
  createdAt?: Date;
  updatedAt?: Date;
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

// Debug info state for tracking canvas setup
export interface DebugInfoState {
  dimensionsSet?: boolean;
  canvasInitialized?: boolean;
  gridCreated?: boolean;
  toolsInitialized?: boolean;
  canvasError?: string;
  lastAction?: string;
}

/**
 * Grid creation callback type
 */
export type GridCreationCallback = (success: boolean) => void;

/**
 * Grid creation state type
 */
export interface GridCreationState {
  isCreating: boolean;
  attempts: number; 
  success: boolean;
  error?: string;
}
