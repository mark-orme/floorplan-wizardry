
/**
 * Grid performance tracking
 * Tracks and reports grid creation performance metrics
 * @module grid/performanceTracking
 */
import logger from "../logger";
import { captureMessage } from "../sentry";

/**
 * Track grid creation performance metrics
 * 
 * @param {boolean} success - Whether grid creation was successful
 * @param {number} duration - Duration in milliseconds
 * @param {Object} dimensions - Canvas dimensions
 * @param {number} objectCount - Number of grid objects created
 */
export const trackGridCreationPerformance = (
  success: boolean, 
  duration: number, 
  dimensions: { width: number; height: number },
  objectCount: number
): void => {
  // Log performance data
  logger.debug("Grid creation performance:", {
    success,
    duration,
    dimensions,
    objectCount,
    objectsPerSecond: Math.round(objectCount / (duration / 1000))
  });
  
  // Report performance data to Sentry
  captureMessage(
    `Grid creation ${success ? "succeeded" : "failed"} in ${duration.toFixed(1)}ms`,
    "grid-creation-performance",
    {
      level: "info",
      tags: {
        component: "grid",
        operation: "creation-performance",
        success: success.toString()
      },
      extra: {
        duration,
        dimensions,
        objectCount,
        timestamp: new Date().toISOString(),
        objectsPerSecond: Math.round(objectCount / (duration / 1000)),
        performanceInfo: {
          // Check if memory API is available before accessing it
          // The Performance.memory is a non-standard API only available in some browsers
          memory: typeof performance !== 'undefined' && 
                 'memory' in performance ? {
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize
          } : 'Not available'
        }
      }
    }
  );
};
