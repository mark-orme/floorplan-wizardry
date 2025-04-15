
/**
 * Debug information state
 * Tracks various debugging metrics for the canvas
 */
export interface DebugInfoState {
  /** Whether there's an error */
  hasError: boolean;
  /** Error message if any */
  errorMessage: string;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Whether event handlers are set */
  eventHandlersSet?: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether grid is rendered */
  gridRendered: boolean;
  /** Whether tools are initialized */
  toolsInitialized: boolean;
  /** Whether grid is created */
  gridCreated?: boolean;
  /** Whether canvas is initialized */
  canvasInitialized?: boolean;
  /** Whether dimensions are set */
  dimensionsSet?: boolean;
  /** Whether brush is initialized */
  brushInitialized?: boolean;
  /** Whether canvas is ready */
  canvasReady?: boolean;
  /** Whether canvas is created */
  canvasCreated?: boolean;
  /** Number of grid objects */
  gridObjectCount?: number;
  /** Number of total objects */
  objectCount?: number;
  /** Canvas dimensions */
  canvasDimensions?: {
    width: number;
    height: number;
  };
  /** Canvas width */
  canvasWidth?: number;
  /** Canvas height */
  canvasHeight?: number;
  /** Device pixel ratio */
  devicePixelRatio?: number;
  /** Last error */
  lastError?: string;
  /** Last error time */
  lastErrorTime?: number;
  /** Last refresh time */
  lastRefresh?: number;
  /** Performance statistics */
  performanceStats?: {
    /** Frames per second */
    fps?: number;
    /** Number of dropped frames */
    droppedFrames?: number;
    /** Average frame time in milliseconds */
    frameTime?: number;
    /** Maximum frame time in milliseconds */
    maxFrameTime?: number;
    /** Number of long frames */
    longFrames?: number;
    /** Error count */
    errorCount?: number;
    /** Retry count */
    retryCount?: number;
    /** Any other performance metrics */
    [key: string]: number | undefined;
  };
  /** Legacy performance field */
  performance?: {
    fps?: number;
    [key: string]: any;
  };
  /** Whether to show debug info */
  showDebugInfo?: boolean;
  /** Additional properties */
  [key: string]: any;
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  gridCreated: false,
  canvasInitialized: false,
  dimensionsSet: false,
  brushInitialized: false,
  canvasReady: false,
  canvasCreated: false,
  gridObjectCount: 0,
  objectCount: 0,
  canvasDimensions: {
    width: 0,
    height: 0
  },
  canvasWidth: 0,
  canvasHeight: 0,
  devicePixelRatio: window.devicePixelRatio || 1,
  performanceStats: {
    fps: 0,
    droppedFrames: 0,
    frameTime: 0,
    maxFrameTime: 0,
    longFrames: 0,
    errorCount: 0,
    retryCount: 0
  },
  showDebugInfo: process.env.NODE_ENV === 'development',
  lastError: '',
  lastRefresh: Date.now()
};
