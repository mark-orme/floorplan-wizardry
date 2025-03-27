
/**
 * Debug information state type definitions
 * @module core/DebugInfo
 */
import { CanvasDimensions } from './Geometry';

/**
 * Performance statistics interface
 * Tracks performance metrics for canvas operations
 * @interface PerformanceStats
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
  /** Custom performance metrics */
  [key: string]: number | undefined;
}

/**
 * Debug information state interface
 * Core debug information for canvas state
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
  /** Whether event handlers are set */
  eventHandlersSet: boolean;
  /** Whether brush has been initialized */
  brushInitialized: boolean;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Whether canvas has been created */
  canvasCreated: boolean;
  /** Whether canvas has been loaded */
  canvasLoaded: boolean;
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
  /** Number of grid objects */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
  /** Error state */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance statistics */
  performanceStats: PerformanceStats;
  
  // Optional debug fields
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
  /** Any additional debug info */
  [key: string]: boolean | number | string | object | undefined;
}
