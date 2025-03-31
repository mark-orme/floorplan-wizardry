
/**
 * Drawing types
 * Provides types for drawing operations and states
 * @module types/drawingTypes
 */
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';
import { Point, CanvasDimensions } from '@/types/core/Geometry';

/**
 * @deprecated Use DrawingTool from src/types/core/DrawingTool.ts instead
 * This is kept for backward compatibility
 */
export type { DrawingTool };

/**
 * @deprecated Use DrawingMode from @/constants/drawingModes instead
 * This is kept for backward compatibility
 */
export { DrawingMode };

// Export geometry types for backward compatibility
export type { Point, CanvasDimensions };

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
  canvasReady: boolean;
  /** Canvas created flag */
  canvasCreated?: boolean;
  /** Canvas loaded flag */
  canvasLoaded?: boolean;
  /** Grid object count */
  gridObjectCount?: number;
  /** Canvas dimensions */
  canvasDimensions?: { width: number; height: number };
  /** Last error message */
  lastError: string | null;
  /** Timestamp of last refresh */
  lastRefresh: number;
  /** Canvas width */
  canvasWidth?: number;
  /** Canvas height */
  canvasHeight?: number;
  /** Device pixel ratio */
  devicePixelRatio?: number;
  /** Count of canvas objects */
  objectCount?: number;
  /** Timestamp of last error */
  lastErrorTime?: number;
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
 * Drawing state interface
 * Contains the current state of drawing operations
 */
export interface DrawingState {
  /** Whether drawing is currently active */
  isDrawing: boolean;
  /** Current path being drawn */
  currentPath: any | null;
  /** Starting point of the current path */
  pathStartPoint: Point | null;
  /** Current zoom level */
  zoomLevel: number;
  /** Starting point for tools like measure */
  startPoint: Point | null;
  /** Current point position */
  currentPoint: Point | null;
  /** Collection of points for the current drawing */
  points: Point[];
  /** Measured distance value */
  distance: number | null;
  /** Current cursor position */
  cursorPosition: Point | null;
  /** Current canvas zoom level */
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
