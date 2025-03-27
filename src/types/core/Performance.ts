
/**
 * Performance metrics type definitions
 * @module core/Performance
 */

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage?: number;
  loadTime?: number;
}

/**
 * Render statistics interface
 */
export interface RenderStats {
  frames: number;
  totalTime: number;
  averageTime: number;
  maxTime: number;
  minTime: number;
  startTime: number;
  endTime: number;
}

/**
 * Timing record interface
 */
export interface TimingRecord {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  metadata?: Record<string, any>;
}
