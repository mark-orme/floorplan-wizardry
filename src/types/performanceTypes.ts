
/**
 * Performance metrics type definitions
 * @module performanceTypes
 */

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
