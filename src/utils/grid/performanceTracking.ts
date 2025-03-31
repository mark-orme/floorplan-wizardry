
/**
 * Grid performance tracking utilities
 * @module utils/grid/performanceTracking
 */

import logger from "@/utils/logger";

/**
 * Performance record object
 */
interface PerformanceRecord {
  /** Operation being measured */
  operation: string;
  /** Start time in milliseconds */
  startTime: number;
  /** End time in milliseconds (if completed) */
  endTime?: number;
  /** Duration in milliseconds (if completed) */
  duration?: number;
  /** Whether the operation succeeded */
  success?: boolean;
  /** Additional data related to the operation */
  data?: Record<string, any>;
}

/**
 * Global performance records
 */
const performanceRecords: PerformanceRecord[] = [];

/**
 * Track grid creation performance
 * 
 * @param {string} operation - Operation name to track
 * @param {() => Promise<T>} fn - Function to execute and measure
 * @param {object} data - Additional data to record
 * @returns {Promise<T>} Result of the function
 */
export const trackGridCreationPerformance = async <T>(
  operation: string,
  fn: () => Promise<T>,
  data: Record<string, any> = {}
): Promise<T> => {
  // Create performance record
  const record: PerformanceRecord = {
    operation,
    startTime: performance.now(),
    data
  };
  
  // Add to records
  performanceRecords.push(record);
  
  try {
    // Execute and time the operation
    const result = await fn();
    
    // Update record with completion data
    record.endTime = performance.now();
    record.duration = record.endTime - record.startTime;
    record.success = true;
    
    // Log performance data
    logger.debug(`Performance: ${operation} completed in ${record.duration.toFixed(2)}ms`, data);
    
    return result;
  } catch (error) {
    // Update record with error data
    record.endTime = performance.now();
    record.duration = record.endTime - record.startTime;
    record.success = false;
    record.data = { ...record.data, error };
    
    // Log error
    logger.error(`Performance: ${operation} failed after ${record.duration.toFixed(2)}ms`, error);
    
    throw error;
  }
};

/**
 * Get grid creation performance history
 * @returns {PerformanceRecord[]} Performance records
 */
export const getGridPerformanceHistory = (): PerformanceRecord[] => {
  return [...performanceRecords];
};

/**
 * Clear grid creation performance history
 */
export const clearGridPerformanceHistory = (): void => {
  performanceRecords.length = 0;
};
