
/**
 * Debug information state type definitions
 * @module debugTypes
 */

/**
 * Performance metrics for canvas rendering
 */
export interface PerformanceStats {
  /** Frames per second */
  fps: number;
  /** Number of dropped frames */
  droppedFrames: number;
  /** Average frame time in milliseconds */
  frameTime: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime: number;
  /** Count of frames that took longer than budget */
  longFrames: number;
}

/**
 * Debug information state for tracking canvas initialization and grid creation
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether the canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Whether the canvas dimensions have been set */
  dimensionsSet: boolean;
  /** Whether the brush has been initialized */
  brushInitialized: boolean;
  /** Grid creation attempts counter */
  gridCreationAttempts?: number;
  /** Grid creation failures counter */
  gridCreationFailures?: number;
  /** Last time grid creation was attempted */
  lastGridCreationTime?: number;
  /** Last error message */
  lastError?: string | null;
  /** Last error timestamp */
  lastErrorTime?: number;
  /** Number of objects in the canvas */
  canvasObjects?: number;
  /** Number of objects in the grid layer */
  gridObjects?: number;
  /** Canvas width in pixels */
  canvasWidth?: number;
  /** Canvas height in pixels */
  canvasHeight?: number;
  /** Device pixel ratio for HiDPI screens */
  devicePixelRatio?: number;
  /** Whether grid is visible */
  gridVisible?: boolean;
  /** Performance statistics */
  performanceStats?: PerformanceStats;
  /** Index signature to allow additional debug properties */
  [key: string]: unknown;
}
