
/**
 * Performance Statistics Type Definitions
 * 
 * This module provides type definitions for tracking and analyzing performance
 * metrics throughout the application.
 * 
 * @module types/core/PerformanceStats
 */

/**
 * Represents performance statistics for the application.
 */
export interface PerformanceStats {
  /**
   * Current frames per second
   */
  fps: number;
  
  /**
   * Average frames per second over time
   */
  averageFps: number;
  
  /**
   * Time (ms) taken for the last render operation
   */
  lastRenderTime: number;
  
  /**
   * Average render time (ms) over time
   */
  averageRenderTime: number;
  
  /**
   * Total number of objects in the scene
   */
  objectCount: number;
  
  /**
   * Number of visible objects in the current viewport
   */
  visibleObjectCount: number;
  
  /**
   * Memory usage in MB (if available)
   */
  memoryUsage?: number;
  
  /**
   * Time (ms) spent on event handling in the last frame
   */
  eventHandlingTime: number;
  
  /**
   * Time (ms) spent on canvas operations in the last frame
   */
  canvasOperationTime: number;
  
  /**
   * Time (ms) taken for the last grid rendering
   */
  gridRenderTime: number;
  
  /**
   * Timestamp when these stats were collected
   */
  timestamp: number;
  
  /**
   * Time (ms) per frame
   */
  frameTime: number;
  
  /**
   * Maximum frame time observed
   */
  maxFrameTime: number;
  
  /**
   * Count of frames that took longer than threshold
   */
  longFrames: number;
}

/**
 * Default performance stats values
 */
export const DEFAULT_PERFORMANCE_STATS: PerformanceStats = {
  fps: 0,
  averageFps: 0,
  lastRenderTime: 0,
  averageRenderTime: 0,
  objectCount: 0,
  visibleObjectCount: 0,
  eventHandlingTime: 0,
  canvasOperationTime: 0,
  gridRenderTime: 0,
  timestamp: Date.now(),
  frameTime: 0,
  maxFrameTime: 0,
  longFrames: 0
};

/**
 * Performance threshold configuration
 */
export interface PerformanceThresholds {
  /**
   * Minimum acceptable FPS
   * @default 30
   */
  minFps: number;
  
  /**
   * Maximum acceptable render time in ms
   * @default 33
   */
  maxRenderTime: number;
  
  /**
   * Maximum number of objects before optimization is needed
   * @default 1000
   */
  maxObjectCount: number;
}

/**
 * Default performance thresholds
 */
export const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  minFps: 30,
  maxRenderTime: 33, // ~30fps
  maxObjectCount: 1000
};
