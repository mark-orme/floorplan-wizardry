
/**
 * Throttling utilities for canvas operations
 * @module utils/canvas/throttle
 */

/**
 * Throttle a function to run at most once per animation frame
 * @param fn Function to throttle
 * @returns Throttled function
 */
export const throttleRAF = <T extends (...args: any[]) => any>(fn: T): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    // Store the latest args
    lastArgs = args;

    // If we already have a pending frame, don't request another
    if (rafId !== null) return;

    // Schedule the function to run on the next animation frame
    rafId = requestAnimationFrame(() => {
      if (lastArgs) {
        fn(...lastArgs);
      }
      rafId = null;
    });
  };
};

/**
 * Debounce a function to run after a specified delay
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};
