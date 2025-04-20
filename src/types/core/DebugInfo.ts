
/**
 * Debug info state types
 * Provides types for debug information and state
 * @module types/core/DebugInfo
 */

/**
 * Debug info state interface
 */
export interface DebugInfoState {
  /** Whether an error has occurred */
  hasError: boolean;
  
  /** Error message if an error has occurred */
  errorMessage: string;
  
  /** Time taken for last canvas initialization (ms) */
  lastInitTime: number;
  
  /** Time taken for last grid creation (ms) */
  lastGridCreationTime: number;
  
  /** Current rendering FPS */
  currentFps: number;
  
  /** Number of objects in canvas */
  objectCount: number;
  
  /** Canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  
  /** Additional debug flags */
  flags: {
    /** Whether grid is enabled */
    gridEnabled: boolean;
    /** Whether snap to grid is enabled */
    snapToGridEnabled: boolean;
    /** Whether debug logging is enabled */
    debugLoggingEnabled: boolean;
  };
  
  /** Whether canvas is initialized */
  canvasInitialized?: boolean;
  
  /** Whether canvas dimensions are set */
  dimensionsSet?: boolean;
  
  /** Whether grid is created */
  gridCreated?: boolean;
  
  /** Whether event handlers are set */
  eventHandlersSet?: boolean;
  
  /** Whether canvas is ready */
  canvasReady?: boolean;
  
  /** Whether brush is initialized */
  brushInitialized?: boolean;
  
  /** Grid object count */
  gridObjectCount?: number;
  
  /** Canvas width */
  canvasWidth?: number;
  
  /** Canvas height */
  canvasHeight?: number;
  
  /** Device pixel ratio */
  devicePixelRatio?: number;
  
  /** Last error message */
  lastError?: string;
  
  /** Last error timestamp */
  lastErrorTime?: number;
  
  /** Whether to show debug info */
  showDebugInfo?: boolean;
  
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
  };
  
  /** Legacy performance object */
  performance?: {
    /** Frames per second */
    fps?: number;
  };
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  currentFps: 0,
  objectCount: 0,
  canvasDimensions: {
    width: 0,
    height: 0
  },
  flags: {
    gridEnabled: true,
    snapToGridEnabled: false,
    debugLoggingEnabled: false
  },
  canvasInitialized: false,
  dimensionsSet: false,
  gridCreated: false,
  eventHandlersSet: false,
  canvasReady: false,
  brushInitialized: false,
  gridObjectCount: 0,
  showDebugInfo: process.env.NODE_ENV === 'development'
};

/**
 * Debug logger function that only logs in development
 */
export function debugLog(message: string, data?: any): void {
  if (process.env.NODE_ENV !== 'production') {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
}
