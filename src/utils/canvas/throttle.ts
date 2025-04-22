
/**
 * Throttle a function to run at most once per animation frame
 * @param fn The function to throttle
 * @returns Throttled function
 */
export function throttleRAF<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          fn(...lastArgs);
        }
        rafId = null;
      });
    }
  };
}

/**
 * Debounce a function
 * @param fn The function to debounce
 * @param wait Wait time in milliseconds
 * @param leading Whether to call the function on the leading edge
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  leading = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    lastArgs = args;
    
    const callNow = leading && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!leading && lastArgs) {
        fn(...lastArgs);
        lastArgs = null;
      }
    }, wait);
    
    if (callNow) {
      fn(...args);
    }
  };
}

/**
 * Throttle a function to run at most once per specified interval
 * @param fn The function to throttle
 * @param wait Wait time in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    
    lastArgs = args;
    
    if (remaining <= 0) {
      // It's time to execute
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      lastTime = now;
      fn(...args);
    } else if (!timeoutId) {
      // Schedule execution at the end of wait period
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, remaining);
    }
  };
}
