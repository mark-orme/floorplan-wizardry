
/**
 * Throttle utility for optimizing high-frequency events
 * Especially useful for pointer/mouse events during drawing
 * @module utils/canvas/throttle
 */

/**
 * Throttle a function to limit how often it can be called
 * Uses requestAnimationFrame for optimal performance
 * 
 * @param {Function} callback - The function to throttle
 * @returns {Function} Throttled function
 */
export function throttleRAF<T extends (...args: any[]) => void>(callback: T): T {
  let requestId: number | null = null;
  let lastArgs: any[] | null = null;
  
  const throttled = (...args: any[]) => {
    // Store the latest arguments
    lastArgs = args;
    
    // Only schedule a new frame if we don't already have one pending
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        if (lastArgs) {
          callback(...lastArgs);
        }
        requestId = null;
      });
    }
  };
  
  return throttled as T;
}

/**
 * Debounce a function to delay execution until after a pause
 * 
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  let timeoutId: number | null = null;
  
  const debounced = (...args: any[]) => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      callback(...args);
      timeoutId = null;
    }, delay);
  };
  
  return debounced as T;
}
