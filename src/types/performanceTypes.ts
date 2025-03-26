
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
  /** Timestamp when measurement started */
  measuredSince?: number;
}

/**
 * Canvas load times interface
 * Used for tracking canvas initialization times
 */
export interface CanvasLoadTimes {
  /** Timestamp when canvas initialization started */
  startInitTime: number;
  /** Timestamp when canvas was initialized */
  canvasInitTime?: number;
  /** Timestamp when grid was created */
  gridCreatedTime?: number;
  /** Timestamp when tools were initialized */
  toolsInitTime?: number;
  /** Timestamp when canvas was fully ready */
  readyTime?: number;
  /** Total initialization time in ms */
  totalInitTime?: number;
  /** Timestamp when canvas became ready */
  canvasReady?: number;
  /** Timestamp when grid was created */
  gridCreated?: number;
  /** Start time for performance measurements */
  startTime?: number;
}
