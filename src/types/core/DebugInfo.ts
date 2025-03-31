
/**
 * Debug information types
 * Defines interfaces for tracking application debug state
 * @module types/core/DebugInfo
 */
import { CanvasDimensions } from './Geometry';

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
  canvasDimensions?: CanvasDimensions;
}

/**
 * Default debug state
 * Initial values for debug information
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  eventHandlersSet: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  gridCreated: false,
  showDebugInfo: false,
  canvasInitialized: false,
  dimensionsSet: false,
  brushInitialized: false,
  canvasReady: false,
  canvasCreated: false,
  canvasLoaded: false,
  gridObjectCount: 0
};
