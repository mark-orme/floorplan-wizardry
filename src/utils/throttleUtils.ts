
/**
 * Utilities for throttling and debouncing functions
 * @module utils/throttleUtils
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): () => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(): void {
    const later = () => {
      timeout = null;
      func();
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): () => void {
  let lastCall = 0;
  
  return function(): void {
    const now = Date.now();
    if (now - lastCall < wait) return;
    
    lastCall = now;
    func();
  };
}
