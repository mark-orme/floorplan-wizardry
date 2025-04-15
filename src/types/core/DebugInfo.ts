
/**
 * Debug information types
 * @module types/core/DebugInfo
 */

/**
 * State of debug information
 */
export interface DebugInfoState {
  /** Whether the canvas is ready */
  canvasReady: boolean;
  /** Whether the canvas is initialized */
  canvasInitialized: boolean;
  /** Whether the canvas was created successfully */
  canvasCreated: boolean;
  /** Whether canvas dimensions were set */
  dimensionsSet: boolean;
  /** Whether grid was created */
  gridCreated?: boolean;
  /** Whether objects were loaded */
  objectsLoaded?: boolean;
  /** Whether an error occurred */
  hasError?: boolean;
  /** Error message if any */
  errorMessage?: string;
  /** Performance stats */
  performance?: {
    /** Frame rate */
    fps: number;
    /** Render time in milliseconds */
    renderTime: number;
    /** Object count */
    objectCount: number;
  };
  
  // Additional properties required by various components
  brushInitialized?: boolean;
  gridObjectCount?: number;
  objectCount?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasDimensions?: { width: number; height: number };
  devicePixelRatio?: number;
  performanceStats?: {
    fps?: number;
    droppedFrames?: number;
    frameTime?: number;
    maxFrameTime?: number;
    longFrames?: number;
    errorCount?: number;
    retryCount?: number;
  };
  lastInitTime?: number;
  lastError?: string | null;
  lastErrorTime?: number;
  showDebugInfo?: boolean;
  eventHandlersSet?: boolean;
  lastGridCreationTime?: number;
  canvasEventsRegistered?: boolean;
  gridRendered?: boolean;
  toolsInitialized?: boolean;
  canvasLoaded?: boolean;
  lastRefresh?: number;
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasReady: false,
  canvasInitialized: false,
  canvasCreated: false,
  dimensionsSet: false,
  gridCreated: false,
  hasError: false,
  errorMessage: '',
  showDebugInfo: false,
  eventHandlersSet: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  lastInitTime: 0,
  lastGridCreationTime: 0,
  lastRefresh: Date.now(),
  performanceStats: {
    fps: 0,
    droppedFrames: 0,
    frameTime: 0,
    maxFrameTime: 0,
    longFrames: 0,
    errorCount: 0,
    retryCount: 0
  }
};
