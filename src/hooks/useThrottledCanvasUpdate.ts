/**
 * Throttled Canvas Update Hook
 * Prevents excessive canvas updates by throttling user interactions
 */
import { useCallback, useRef } from 'react';
import { throttle, debounce } from '@/utils/throttleUtils';

interface UseThrottledCanvasUpdateOptions {
  /** Throttle delay in milliseconds (for continuous updates) */
  throttleMs?: number;
  /** Debounce delay in milliseconds (for final updates) */
  debounceMs?: number;
  /** Whether to execute the debounced function at the beginning of the wait period */
  immediate?: boolean;
}

/**
 * Hook to throttle canvas updates for better performance and security
 * @param updateFn Function to call with throttled/debounced values
 * @param options Configuration options
 * @returns Wrapped function that throttles updates
 */
export function useThrottledCanvasUpdate<T extends (...args: any[]) => any>(
  updateFn: T,
  options: UseThrottledCanvasUpdateOptions = {}
) {
  const { 
    throttleMs = 50, 
    debounceMs = 300,
    immediate = false
  } = options;
  
  // Keep a reference to the original function to prevent recreation
  const updateFnRef = useRef(updateFn);
  updateFnRef.current = updateFn;
  
  // Create throttled version for continuous updates (e.g., during drag)
  const throttledUpdate = useCallback(
    throttle((...args: Parameters<T>) => {
      updateFnRef.current(...args);
    }, throttleMs),
    [throttleMs]
  );
  
  // Create debounced version for final update (e.g., after drag ends)
  const debouncedUpdate = useCallback(
    debounce((...args: Parameters<T>) => {
      updateFnRef.current(...args);
    }, debounceMs, immediate),
    [debounceMs, immediate]
  );
  
  // Hybrid function that uses both throttling and debouncing
  const throttledCanvasUpdate = useCallback((...args: Parameters<T>) => {
    throttledUpdate(...args);
    debouncedUpdate(...args);
  }, [throttledUpdate, debouncedUpdate]);
  
  return {
    throttledUpdate,
    debouncedUpdate,
    throttledCanvasUpdate
  };
}

export default useThrottledCanvasUpdate;
