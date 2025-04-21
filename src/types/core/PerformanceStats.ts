
/**
 * Performance statistics type definitions
 */

/**
 * Performance statistics for monitoring application performance
 */
export interface PerformanceStats {
  /**
   * Frames per second
   */
  fps: number;
  
  /**
   * Time taken to render a frame in milliseconds
   */
  frameTime: number;
  
  /**
   * Maximum frame time recorded in milliseconds
   */
  maxFrameTime: number;
  
  /**
   * Count of frames that took longer than 16ms (60fps threshold)
   */
  longFrames: number;
  
  /**
   * Count of objects on the canvas
   */
  objectCount: number;
  
  /**
   * Count of visible objects after virtualization
   */
  visibleObjectCount: number;
  
  /**
   * Time when metrics were last updated
   */
  lastUpdate: number;
}

/**
 * Default performance stats
 */
export const DEFAULT_PERFORMANCE_STATS: PerformanceStats = {
  fps: 60,
  frameTime: 0,
  maxFrameTime: 0,
  longFrames: 0,
  objectCount: 0,
  visibleObjectCount: 0,
  lastUpdate: 0
};
