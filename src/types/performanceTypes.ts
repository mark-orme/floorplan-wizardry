
/**
 * Type definitions for performance monitoring
 * @module performanceTypes
 */

/**
 * Performance metrics interface
 * Used for tracking rendering and operation performance
 */
export interface PerformanceMetrics {
  /** Frames per second */
  fps: number;
  /** Number of dropped frames */
  droppedFrames: number;
  /** Average frame time in milliseconds */
  frameTime: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime: number;
  /** Number of frames taking longer than 16ms (60fps threshold) */
  longFrames: number;
  /** Time taken for the last operation */
  lastOperationTime?: number;
  /** Memory usage in MB */
  memoryUsage?: number;
}
