
/**
 * Performance monitoring utilities
 * Tools for measuring and optimizing application performance
 * @module performance
 */

/**
 * Interface for performance measurement result
 */
export interface PerformanceMeasurement {
  /** Component or operation name */
  name: string;
  /** Duration in milliseconds */
  duration: number;
  /** Start timestamp */
  startTime: number;
  /** Additional metadata */
  meta?: Record<string, any>;
}

/**
 * Measures performance of synchronous operations
 * @param {string} name - Operation name
 * @param {Function} fn - Function to measure
 * @param {Record<string, any>} meta - Additional metadata
 * @returns {[ReturnType<T>, PerformanceMeasurement]} Result and timing information
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  meta: Record<string, any> = {}
): [ReturnType<T>, PerformanceMeasurement] {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  const measurement: PerformanceMeasurement = {
    name,
    duration: endTime - startTime,
    startTime,
    meta
  };
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`⏱️ ${name}: ${measurement.duration.toFixed(2)}ms`);
  }
  
  return [result, measurement];
}

/**
 * Measures performance of asynchronous operations
 * @param {string} name - Operation name
 * @param {Function} fn - Async function to measure
 * @param {Record<string, any>} meta - Additional metadata
 * @returns {Promise<[Awaited<ReturnType<T>>, PerformanceMeasurement]>} Result and timing information
 */
export async function measureAsyncPerformance<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T,
  meta: Record<string, any> = {}
): Promise<[Awaited<ReturnType<T>>, PerformanceMeasurement]> {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  
  const measurement: PerformanceMeasurement = {
    name,
    duration: endTime - startTime,
    startTime,
    meta
  };
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`⏱️ ${name}: ${measurement.duration.toFixed(2)}ms`);
  }
  
  return [result, measurement];
}

/**
 * React Profiler onRender callback for performance monitoring
 * @param {string} id - Component ID
 * @param {string} phase - "mount" | "update"
 * @param {number} actualDuration - Time spent rendering
 * @param {number} baseDuration - Estimated time for full render
 * @param {number} startTime - When React began rendering
 * @param {number} commitTime - When React committed changes
 */
export const profileRender = (
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  // Only log if duration is significant (>5ms)
  if (actualDuration > 5) {
    console.log(`⚛️ [${phase}] ${id}: ${actualDuration.toFixed(2)}ms (baseline: ${baseDuration.toFixed(2)}ms)`);
  }
};
