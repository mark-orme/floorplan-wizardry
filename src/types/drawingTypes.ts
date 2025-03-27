
/**
 * Drawing information state type definitions
 * @module drawingTypes
 */

import { Point } from './core/Point';
import { PerformanceStats } from './core/DebugInfo';

/**
 * Drawing state interface
 * @interface DrawingState
 */
export interface DrawingState {
  /** Whether user is actively drawing */
  isDrawing: boolean;
  /** Starting point of drawing */
  startPoint: Point | null;
  /** Current point being drawn to */
  currentPoint: Point | null;
  /** Midpoint for curved lines */
  midPoint: Point | null;
  /** Whether selection is active */
  selectionActive: boolean;
  /** Current zoom level */
  currentZoom: number;
  /** Array of points in path */
  points: Point[];
  /** Calculated distance between points */
  distance: number | null;
}

/**
 * Drawing mode enumeration
 */
export enum DrawingMode {
  /** Free drawing mode */
  FREE = 'free',
  /** Line drawing mode */
  LINE = 'line',
  /** Rectangle drawing mode */
  RECTANGLE = 'rectangle',
  /** Circle drawing mode */
  CIRCLE = 'circle',
  /** Text insertion mode */
  TEXT = 'text',
  /** Selection mode */
  SELECT = 'select'
}

/**
 * Debug information state interface
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether to show debug information */
  showDebugInfo: boolean;
  /** Whether canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether dimensions have been set */
  dimensionsSet: boolean;
  /** Whether grid has been created */
  gridCreated: boolean;
  /** Whether brush has been initialized */
  brushInitialized: boolean;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Whether canvas has been created */
  canvasCreated: boolean;
  /** Whether canvas has been loaded */
  canvasLoaded: boolean;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Grid initialization state */
  gridInitialized?: boolean;
  /** Custom debug messages */
  messages?: string[];
  /** Amount of objects on canvas */
  objectCount?: number;
  /** Canvas dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Current tool */
  currentTool?: string;
  /** Canvas initialization time */
  initTime?: number;
  /** Number of grid objects */
  gridObjects?: number;
  /** Number of grid objects */
  gridObjectCount: number;
  /** Number of canvas objects */
  canvasObjects?: number;
  /** Canvas width */
  canvasWidth?: number;
  /** Canvas height */
  canvasHeight?: number;
  /** Device pixel ratio */
  devicePixelRatio?: number;
  /** Last error that occurred */
  lastError?: any;
  /** Timestamp of the last error */
  lastErrorTime?: number;
  /** Canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  /** Error state */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance statistics */
  performanceStats: PerformanceStats;
}

// Export Point to make it available to importers of drawingTypes
export type { Point };

// Export CanvasDimensions for compatibility with imports
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

// Export other drawing related types here
