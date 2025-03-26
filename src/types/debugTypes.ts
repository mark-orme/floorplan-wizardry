
/**
 * Debug info state type for tracking canvas initialization
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether the canvas element is ready */
  canvasReady: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Timestamp of last initialization */
  lastInitTime: number;
  /** Timestamp of last grid creation */
  lastGridCreationTime: number;
  /** Whether canvas dimensions have been set (optional) */
  dimensionsSet?: boolean;
  /** Whether canvas has been initialized (optional) */
  canvasInitialized?: boolean;
  /** Whether brush is initialized (optional) */
  brushInitialized?: boolean;
  /** Whether canvas is created (optional) */
  canvasCreated?: boolean;
  /** Whether canvas is loaded (optional) */
  canvasLoaded?: boolean;
  /** Canvas width in pixels (optional) */
  canvasWidth?: number;
  /** Canvas height in pixels (optional) */
  canvasHeight?: number;
  /** Device pixel ratio (optional) */
  devicePixelRatio?: number;
  /** Number of grid objects (optional) */
  gridObjects?: number;
  /** Number of canvas objects (optional) */
  canvasObjects?: number;
  /** Dimension setup attempts (optional) */
  dimensionAttempts?: number;
  /** Last error message (optional) */
  lastError?: string;
  /** Last error timestamp (optional) */
  lastErrorTime?: number;
  /** Initialization time in milliseconds (optional) */
  initTime?: number;
  /** Performance statistics (optional) */
  performanceStats?: {
    /** Render time in milliseconds */
    renderTime?: number;
    /** Grid creation time in milliseconds */
    gridCreationTime?: number;
    /** Object creation time in milliseconds */
    objectCreationTime?: number;
    /** Frame rate */
    fps?: number;
    /** Dropped frames count */
    droppedFrames?: number;
    /** Average frame time in milliseconds */
    frameTime?: number;
    /** Maximum frame time in milliseconds */
    maxFrameTime?: number;
    /** Count of long frames */
    longFrames?: number;
  };
}
