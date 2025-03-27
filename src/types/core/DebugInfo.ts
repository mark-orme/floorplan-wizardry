
/**
 * Debug information state type definition
 * @module core/DebugInfo
 */
import { CanvasDimensions } from './Geometry';

/**
 * Performance statistics interface
 * Tracks performance-related metrics
 */
export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Number of frames that took too long to render */
  longFrames?: number;
  /** Number of dropped frames */
  droppedFrames?: number;
  /** Memory usage in MB */
  memory?: number;
  /** Number of canvas objects */
  objectCount?: number;
  /** Number of draw calls */
  drawCalls?: number;
  /** Render time in milliseconds */
  renderTime?: number;
  /** Event processing time in milliseconds */
  eventTime?: number;
  /** Error count */
  errorCount?: number;
  /** Retry count */
  retryCount?: number;
  /** Index signature for additional metrics */
  [key: string]: number | undefined;
}

/**
 * Debug info state interface
 * Tracks debug and performance information
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether to show debug info */
  showDebugInfo: boolean;
  /** Whether canvas is initialized */
  canvasInitialized: boolean;
  /** Whether dimensions are set */
  dimensionsSet: boolean;
  /** Whether grid is created */
  gridCreated: boolean;
  /** Whether brush is initialized */
  brushInitialized: boolean;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Whether canvas is created */
  canvasCreated: boolean;
  /** Whether canvas is loaded */
  canvasLoaded: boolean;
  /** Whether event handlers are set */
  eventHandlersSet: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether grid is rendered */
  gridRendered: boolean;
  /** Whether tools are initialized */
  toolsInitialized: boolean;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Grid object count */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
  /** Whether there's an error */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance stats */
  performanceStats: PerformanceStats;
  /** Canvas width (optional) */
  canvasWidth?: number;
  /** Canvas height (optional) */
  canvasHeight?: number;
  /** Device pixel ratio (optional) */
  devicePixelRatio?: number;
  /** Last error object (optional) */
  lastError?: unknown;
  /** Last error time (optional) */
  lastErrorTime?: number;
  /** Additional properties */
  [key: string]: unknown;
}

/**
 * Default debug state with all required properties
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  showDebugInfo: false,
  canvasInitialized: false,
  dimensionsSet: false,
  gridCreated: false,
  brushInitialized: false,
  canvasReady: false,
  canvasCreated: false,
  canvasLoaded: false,
  eventHandlersSet: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  lastInitTime: 0,
  lastGridCreationTime: 0,
  gridObjectCount: 0,
  canvasDimensions: { width: 0, height: 0 },
  hasError: false,
  errorMessage: '',
  performanceStats: {}
};
