/**
 * Rate Limiting Utilities for Canvas Operations
 * Provides debounce and throttle functions to limit the frequency of expensive operations
 */

/**
 * Debounce function to delay execution until after a period of inactivity
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle function to limit execution frequency
 * @param fn Function to throttle
 * @param limit Minimum time between executions in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    if (timeSinceLastCall >= limit) {
      // If enough time has passed, execute immediately
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      // Otherwise, schedule to run after the remaining time
      const remaining = limit - timeSinceLastCall;
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Canvas rate limiting configuration
 * Default values for different canvas operations
 */
export const canvasRateLimits = {
  // Update frequency for real-time drawing operations (pencil, brush)
  drawingUpdate: 16, // ~60fps
  
  // Update frequency for shape manipulations
  shapeManipulation: 50, // ~20fps
  
  // Delay for more expensive operations (object selection, group actions)
  expensiveOperation: 100,
  
  // Delay for very expensive operations (filters, effects, serialization)
  veryExpensiveOperation: 250,
  
  // Delay for auto-save operations
  autoSave: 2000,
  
  // Delay for history state creation
  historyUpdate: 500
};

/**
 * Create a rate-limited function for canvas operations
 * @param operation Function to rate-limit
 * @param type Type of operation to determine appropriate rate limit
 * @returns Rate-limited function
 */
export function createRateLimitedCanvasOperation<T extends (...args: any[]) => any>(
  operation: T,
  type: keyof typeof canvasRateLimits = 'drawingUpdate'
): (...args: Parameters<T>) => void {
  // Use the appropriate rate limit based on operation type
  const limit = canvasRateLimits[type];
  
  // For drawing and shape manipulation, use throttle
  if (type === 'drawingUpdate' || type === 'shapeManipulation') {
    return throttle(operation, limit);
  }
  
  // For everything else, use debounce
  return debounce(operation, limit);
}
