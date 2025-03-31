
/**
 * Grid performance tracking
 * @module utils/grid/performanceTracking
 */
import logger from "@/utils/logger";

/**
 * Track grid creation performance
 * 
 * @param {string} operation - Operation being tracked
 * @param {() => T} fn - Function to track
 * @returns {T} Result of function
 */
export const trackGridCreationPerformance = <T>(
  operation: string,
  fn: () => T
): T => {
  const start = performance.now();
  
  try {
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    logger.info(`Grid performance: ${operation} took ${duration.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    
    logger.error(`Grid performance: ${operation} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};
