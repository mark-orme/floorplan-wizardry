
/**
 * useRateLimitedUpdate Hook
 * Custom hook for rate-limiting state updates and expensive calculations
 * 
 * @module hooks/useRateLimitedUpdate
 */
import { useCallback, useRef, useEffect } from 'react';
import { debounce, throttle } from '@/utils/throttleUtils';

type UpdateFunction<T> = (value: T) => void;
type Method = 'debounce' | 'throttle';

interface RateLimitOptions {
  /** Rate limiting method to use */
  method?: Method;
  /** Delay in milliseconds */
  delay?: number;
  /** Whether to call the update function immediately on first call */
  leading?: boolean;
  /** Whether to call the update function after delay even if called multiple times */
  trailing?: boolean;
}

/**
 * Hook for rate-limiting state updates
 * 
 * @param updateFn - Function to call with rate-limiting
 * @param options - Rate limiting configuration
 * @returns Rate-limited update function
 * 
 * @example
 * ```tsx
 * const [canvasState, setCanvasState] = useState(initialState);
 * const updateCanvasState = useRateLimitedUpdate(setCanvasState, { 
 *   method: 'debounce', 
 *   delay: 100 
 * });
 * 
 * // Use the rate-limited function instead of setState directly
 * updateCanvasState(newState);
 * ```
 */
export function useRateLimitedUpdate<T>(
  updateFn: UpdateFunction<T>,
  options: RateLimitOptions = {}
): UpdateFunction<T> {
  const { 
    method = 'debounce', 
    delay = 100,
    leading = false,
    trailing = true
  } = options;
  
  // Keep a ref to the latest update function to avoid stale closures
  const updateFnRef = useRef(updateFn);
  
  // Update the ref when the update function changes
  useEffect(() => {
    updateFnRef.current = updateFn;
  }, [updateFn]);
  
  // Create a memoized rate-limited function
  const rateLimitedFn = useCallback((value: T) => {
    if (method === 'debounce') {
      const debouncedFn = debounce(() => {
        updateFnRef.current(value);
      }, delay);
      debouncedFn();
    } else {
      const throttledFn = throttle(() => {
        updateFnRef.current(value);
      }, delay);
      throttledFn();
    }
  }, [method, delay]);
  
  return rateLimitedFn;
}

/**
 * Hook for debouncing state updates
 * Shorthand for useRateLimitedUpdate with debounce method
 * 
 * @param updateFn - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced update function
 */
export function useDebouncedUpdate<T>(
  updateFn: UpdateFunction<T>,
  delay = 250
): UpdateFunction<T> {
  return useRateLimitedUpdate(updateFn, { method: 'debounce', delay });
}

/**
 * Hook for throttling state updates
 * Shorthand for useRateLimitedUpdate with throttle method
 * 
 * @param updateFn - Function to throttle
 * @param delay - Throttle interval in milliseconds
 * @returns Throttled update function
 */
export function useThrottledUpdate<T>(
  updateFn: UpdateFunction<T>,
  delay = 100
): UpdateFunction<T> {
  return useRateLimitedUpdate(updateFn, { method: 'throttle', delay });
}

export default useRateLimitedUpdate;
