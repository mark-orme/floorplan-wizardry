
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
  
  // Added missing properties from error messages
  brushInitialized?: boolean;
  gridObjectCount?: number;
  objectCount?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasDimensions?: { width: number; height: number };
  devicePixelRatio?: number;
  performanceStats?: {
    droppedFrames?: number;
    frameTime?: number;
    maxFrameTime?: number;
    longFrames?: number;
  };
  lastInitTime?: number;
  lastError?: string;
  lastErrorTime?: number;
  showDebugInfo?: boolean;
  eventHandlersSet?: boolean;
}

/**
 * Default debug state
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  canvasReady: false,
  canvasInitialized: false,
  canvasCreated: false,
  dimensionsSet: false,
  // Initialize additional properties with sensible defaults
  hasError: false,
  showDebugInfo: false,
  eventHandlersSet: false
};
