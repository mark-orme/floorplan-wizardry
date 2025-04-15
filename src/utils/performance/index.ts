
/**
 * Performance utilities for monitoring and reporting
 * @module utils/performance
 */

// Re-export key functionality
export * from './types';
export * from './collector';
export * from './resourceUtils';
export * from './reportGenerator';
export * from './downloader';

// Export a measurement class for tracking performance
export interface PerformanceMeasurement {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  metadata?: Record<string, unknown>;
}

/**
 * Create a performance measurement
 */
export const createMeasurement = (
  name: string, 
  startTime: number, 
  endTime: number, 
  metadata?: Record<string, unknown>
): PerformanceMeasurement => {
  return {
    name,
    startTime,
    endTime,
    duration: endTime - startTime,
    metadata
  };
};

/**
 * Measure the execution time of a function
 */
export const measureExecutionTime = <T>(fn: () => T, name: string): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`[Performance] ${name}: ${Math.round((end - start) * 100) / 100}ms`);
  return result;
};
