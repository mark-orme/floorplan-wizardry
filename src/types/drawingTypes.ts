
/**
 * Drawing tool enum
 * Defines all available tools for canvas drawing
 */
export enum DrawingTool {
  SELECT = "select",
  DRAW = "draw",
  WALL = "wall",
  ROOM = "room",
  MEASURE = "measure",
  TEXT = "text",
  ERASER = "eraser",
  LINE = "line",
  RECTANGLE = "rectangle",
  CIRCLE = "circle",
  STRAIGHT_LINE = "straightLine",
  HAND = "hand"
}

/**
 * Drawing tool type based on enum
 * String literal type for drawing tools
 */
export type DrawingToolType = `${DrawingTool}`;

/**
 * @deprecated Use DrawingTool from src/types/drawingTypes.ts instead
 * This is kept for backward compatibility
 */
export type DrawingMode = DrawingTool;

// For compatibility with existing code
export type ZoomDirection = "in" | "out";

/**
 * Performance statistics interface
 * Contains metrics for performance tracking
 */
export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Number of dropped frames */
  droppedFrames?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Number of long frames (frames taking longer than 16ms) */
  longFrames?: number;
  /** Additional performance metrics */
  [key: string]: number | undefined;
}

/**
 * Debug information state interface
 * Contains properties for tracking debug state
 */
export interface DebugInfoState {
  /** Whether the application has an error */
  hasError: boolean;
  /** Error message if an error occurred */
  errorMessage: string;
  /** Time taken for last initialization */
  lastInitTime: number;
  /** Time taken for last grid creation */
  lastGridCreationTime: number;
  /** Whether event handlers have been set */
  eventHandlersSet: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether the grid has been rendered */
  gridRendered: boolean;
  /** Whether drawing tools have been initialized */
  toolsInitialized: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Performance statistics */
  performanceStats?: PerformanceStats;
  /** Show debug info flag */
  showDebugInfo?: boolean;
  /** Canvas initialization flag */
  canvasInitialized?: boolean;
  /** Dimensions set flag */
  dimensionsSet?: boolean;
  /** Brush initialized flag */
  brushInitialized?: boolean;
  /** Canvas ready flag */
  canvasReady?: boolean;
  /** Canvas created flag */
  canvasCreated?: boolean;
  /** Canvas loaded flag */
  canvasLoaded?: boolean;
  /** Grid object count */
  gridObjectCount?: number;
  /** Canvas dimensions */
  canvasDimensions?: { width: number; height: number };
  /** Additional debug properties */
  [key: string]: string | number | boolean | object | undefined;
}

/**
 * Distance tool state interface
 * Contains properties for tracking distance measurements
 */
export interface DistanceToolState {
  /** Whether the distance tool is active */
  isActive: boolean;
  /** Start point of measurement */
  startPoint: Point | null;
  /** End point of measurement */
  endPoint: Point | null;
  /** Current measured distance */
  distance: number | null;
  /** Current measurement label */
  label: string | null;
  /** Measurement unit */
  unit: string;
}

/**
 * Represents a point in 2D space
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Canvas dimensions type
 * Represents the width and height of the canvas
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

/**
 * Drawing state interface
 * Contains the current state of drawing operations
 */
export interface DrawingState {
  isDrawing: boolean;
  currentPath: any | null;
  pathStartPoint: { x: number, y: number } | null;
  zoomLevel: number;
  
  // Additional properties needed by tests
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  distance: number | null;
  cursorPosition: Point | null;
  currentZoom: number;
}

/**
 * Create a default drawing state
 * @returns {DrawingState} A new drawing state with default values
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  zoomLevel: 1,
  currentPath: null,
  pathStartPoint: null,
  startPoint: null,
  currentPoint: null,
  points: [],
  distance: null,
  cursorPosition: null,
  currentZoom: 1
});
