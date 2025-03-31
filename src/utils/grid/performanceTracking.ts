
/**
 * Grid performance tracking module
 * Monitors and reports grid creation performance
 * @module grid/performanceTracking
 */
import { PerformanceStats } from "@/types";
import logger from "../logger";

/** Performance tracking data */
interface GridPerformanceData {
  /** Start time in milliseconds */
  startTime: number;
  /** End time in milliseconds */
  endTime: number | null;
  /** Number of objects created */
  objectCount: number;
  /** Stats collected during operation */
  stats: PerformanceStats;
  /** Operation name */
  operation: string;
}

// Store recent performance data
const recentPerformance: GridPerformanceData[] = [];
const MAX_STORED_OPERATIONS = 10;

/**
 * Start tracking grid creation performance
 * 
 * @param {string} operation - Name of the operation
 * @returns {GridPerformanceData} Performance data object
 */
export const startGridPerformanceTracking = (operation: string): GridPerformanceData => {
  const performanceData: GridPerformanceData = {
    startTime: performance.now(),
    endTime: null,
    objectCount: 0,
    stats: {
      fps: 0,
      droppedFrames: 0,
      frameTime: 0,
      maxFrameTime: 0,
      longFrames: 0
    },
    operation
  };
  
  return performanceData;
};

/**
 * End performance tracking and calculate metrics
 * 
 * @param {GridPerformanceData} data - Performance data
 * @param {number} objectCount - Number of objects created
 * @returns {PerformanceStats} Performance statistics
 */
export const endGridPerformanceTracking = (
  data: GridPerformanceData, 
  objectCount: number
): PerformanceStats => {
  const endTime = performance.now();
  const duration = endTime - data.startTime;
  
  // Update the performance data
  data.endTime = endTime;
  data.objectCount = objectCount;
  
  // Calculate performance metrics
  const stats: PerformanceStats = {
    ...data.stats,
    objectsPerSecond: objectCount / (duration / 1000),
    creationTime: duration,
    objectCount: objectCount,
    averageTimePerObject: duration / (objectCount || 1)
  };
  
  // Update the data stats
  data.stats = stats;
  
  // Add to recent performance data
  recentPerformance.unshift(data);
  if (recentPerformance.length > MAX_STORED_OPERATIONS) {
    recentPerformance.pop();
  }
  
  // Log performance data
  logger.info(`Grid performance: ${data.operation}`, {
    duration: `${duration.toFixed(2)}ms`,
    objectCount,
    stats
  });
  
  return stats;
};

/**
 * Track grid creation performance
 * 
 * @param {Function} createFn - Grid creation function
 * @param {string} operation - Operation name
 * @returns {Array} Result of the creation function and performance stats
 */
export const trackGridCreationPerformance = <T>(
  createFn: () => T,
  operation: string = "grid-creation"
): [T, PerformanceStats] => {
  // Start tracking
  const perfData = startGridPerformanceTracking(operation);
  
  // Execute the creation function
  const result = createFn();
  
  // Get object count (if result is an array)
  const objectCount = Array.isArray(result) ? result.length : 0;
  
  // End tracking and get stats
  const stats = endGridPerformanceTracking(perfData, objectCount);
  
  return [result, stats];
};

/**
 * Get recent performance data
 * @returns {GridPerformanceData[]} Recent performance data
 */
export const getRecentPerformanceData = (): GridPerformanceData[] => {
  return [...recentPerformance];
};
