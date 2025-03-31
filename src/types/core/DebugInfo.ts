
/**
 * Debug information type definitions
 * @module types/core/DebugInfo
 */

/**
 * Performance statistics interface
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
 * Contains information about the canvas and grid state for debugging
 */
export interface DebugInfoState {
  /** Whether the canvas was created */
  canvasCreated: boolean;
  /** Whether the canvas was initialized */
  canvasInitialized: boolean;
  /** Whether the brush was initialized */
  brushInitialized: boolean;
  /** Whether dimensions were set */
  dimensionsSet: boolean;
  /** Whether event handlers were set */
  eventHandlersSet: boolean;
  /** Whether the grid was created */
  gridCreated: boolean;
  /** Number of grid objects created */
  gridObjectCount: number;
  /** Current canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  /** Whether the canvas is ready for drawing */
  canvasReady: boolean;
  /** Last error message */
  lastError: string | null;
  /** Timestamp of last refresh */
  lastRefresh: number;
  /** Whether event handlers have been registered */
  canvasEventsRegistered: boolean;
  /** Whether the grid has been rendered */
  gridRendered: boolean;
  /** Whether tools have been initialized */
  toolsInitialized: boolean;
  /** Whether the application has an error */
  hasError: boolean;
  /** Error message if there was an error */
  errorMessage: string;
  /** Time of last initialization */
  lastInitTime: number;
  /** Time of last grid creation */
  lastGridCreationTime: number;
  /** Performance statistics */
  performanceStats?: PerformanceStats;
  /** Whether to show debug information */
  showDebugInfo?: boolean;
  /** Whether the canvas has loaded */
  canvasLoaded?: boolean;
  /** Width of the canvas */
  canvasWidth?: number;
  /** Height of the canvas */
  canvasHeight?: number;
  /** Device pixel ratio */
  devicePixelRatio?: number;
  /** Count of canvas objects */
  objectCount?: number;
  /** Timestamp of last error */
  lastErrorTime?: number;
  /** Additional properties may be present */
  [key: string]: any;
}

/**
 * Default debug information state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasCreated: false,
  canvasInitialized: false,
  brushInitialized: false,
  dimensionsSet: false,
  eventHandlersSet: false,
  gridCreated: false,
  gridObjectCount: 0,
  canvasDimensions: {
    width: 0,
    height: 0
  },
  canvasReady: false,
  lastError: null,
  lastRefresh: Date.now(),
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  devicePixelRatio: window.devicePixelRatio || 1,
  objectCount: 0,
  lastErrorTime: 0,
  showDebugInfo: false
};
