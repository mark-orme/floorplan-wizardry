
/**
 * Performance statistics interface
 * Contains metrics for performance tracking
 */
export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Number of dropped frames */
  droppedFrames?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Number of long frames (frames taking longer than 16ms) */
  longFrames?: number;
  /** Additional performance metrics */
  [key: string]: number | undefined;
}

/**
 * Default performance stats
 */
export const DEFAULT_PERFORMANCE_STATS: PerformanceStats = {
  fps: 0,
  droppedFrames: 0,
  frameTime: 0,
  maxFrameTime: 0,
  longFrames: 0
};

