/**
 * Throttle and debounce utilities
 * Helps prevent excessive function calls
 */

/**
 * Throttle a function to run at most once per specified interval
 * @param fn Function to throttle
 * @param limit Time in milliseconds to throttle
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return function throttled(...args: Parameters<T>): void {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    // Store latest args
    lastArgs = args;
    
    // If enough time has passed, call the function immediately
    if (timeSinceLastCall >= limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      lastCall = now;
      fn(...args);
      return;
    }
    
    // Otherwise, schedule a call to happen after the interval
    if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        if (lastArgs) {
          fn(...lastArgs);
        }
      }, limit - timeSinceLastCall);
    }
  };
}

/**
 * Debounce a function to run only after calls have stopped for a specified interval
 * @param fn Function to debounce
 * @param wait Time in milliseconds to wait
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function debounced(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      fn(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Create a function that's both throttled and debounced
 * Ensures function runs at most once per interval, and also after calls stop
 * @param fn Function to process
 * @param throttleMs Throttle interval in milliseconds
 * @param debounceMs Debounce wait in milliseconds
 * @returns Throttled and debounced function
 */
export function throttleAndDebounce<T extends (...args: any[]) => any>(
  fn: T,
  throttleMs: number,
  debounceMs: number
): (...args: Parameters<T>) => void {
  const throttled = throttle(fn, throttleMs);
  return debounce(throttled, debounceMs);
}
