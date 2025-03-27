/**
 * Utility functions for throttling operations
 * Helps prevent excessive function calls
 * @module throttleUtils
 */

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per specified interval
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  let timeoutId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();
    
    // Clear any existing timeout
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // If enough time has elapsed since last call, execute immediately
    if (now - lastCall >= limit) {
      lastCall = now;
      return func.apply(this, args);
    } 
    
    // Otherwise, schedule execution at the end of the throttle period
    lastArgs = args;
    timeoutId = window.setTimeout(() => {
      if (lastArgs !== null) {
        lastCall = Date.now();
        func.apply(this, lastArgs);
      }
      timeoutId = null;
      lastArgs = null;
    }, limit - (now - lastCall));
    
    return undefined;
  };
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @param {boolean} immediate - Whether to invoke at the beginning of the wait period
 * @returns {Function} Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const callNow = immediate && timeoutId === null;
    
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, wait);
    
    if (callNow) {
      func.apply(this, args);
    }
  };
}
