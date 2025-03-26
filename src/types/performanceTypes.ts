
/**
 * Types for canvas performance tracking
 * @module performanceTypes
 */

/**
 * Performance tracking result interface
 * @interface PerformanceMetrics
 */
export interface PerformanceMetrics {
  /** Average FPS */
  fps: number;
  /** Number of dropped frames */
  droppedFrames: number;
  /** Average frame time in milliseconds */
  frameTime: number;
  /** Maximum frame time recorded */
  maxFrameTime: number;
  /** Frames exceeding budget (potential stutters) */
  longFrames: number;
  /** Reference time for measurements */
  measuredSince: Date;
}

/**
 * Canvas load times type
 * @interface CanvasLoadTimes
 */
export interface CanvasLoadTimes {
  startTime: number;
  canvasInitStart: number;
  canvasInitEnd: number;
  gridCreationStart: number;
  gridCreationEnd: number;
  totalLoadTime: number;
  canvasReady: boolean;
  gridCreated: boolean;
}
