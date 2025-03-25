
/**
 * Grid attempt tracker module
 * Tracks and manages grid creation attempts
 * @module gridAttemptTracker
 */

/**
 * Grid attempt tracking state
 */
export interface GridAttemptTracker {
  /** Current attempt count */
  count: number;
  
  /** Maximum allowed attempts */
  maxAttempts: number;
  
  /** Whether initial attempt has been made */
  initialAttempted: boolean;
  
  /** Whether creation was successful */
  successful: boolean;
  
  /** Timestamp of last attempt */
  lastAttemptTime: number;
}

/**
 * Create a new grid attempt tracker
 * @returns {GridAttemptTracker} New tracker instance
 */
export const createGridAttemptTracker = (): GridAttemptTracker => ({
  count: 0,
  maxAttempts: 12,
  initialAttempted: false,
  successful: false,
  lastAttemptTime: 0
});

/**
 * Mark the initial grid creation as attempted
 * @param {GridAttemptTracker} tracker - The current tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const markInitialAttempted = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  initialAttempted: true
});

/**
 * Increment the attempt count
 * @param {GridAttemptTracker} tracker - The current tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const incrementAttemptCount = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  count: tracker.count + 1,
  lastAttemptTime: Date.now()
});

/**
 * Mark creation as successful
 * @param {GridAttemptTracker} tracker - The current tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const markCreationSuccessful = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  successful: true
});

/**
 * Check if maximum attempts reached
 * @param {GridAttemptTracker} tracker - The current tracker
 * @returns {boolean} Whether max attempts reached
 */
export const isMaxAttemptsReached = (tracker: GridAttemptTracker): boolean => 
  tracker.count >= tracker.maxAttempts;

/**
 * Reset attempt counter while maintaining other state
 * @param {GridAttemptTracker} tracker - The current tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const resetAttemptCount = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  count: 0
});

/**
 * Check if attempts should be throttled
 * @param {GridAttemptTracker} tracker - The current tracker
 * @param {number} minInterval - Minimum milliseconds between attempts
 * @returns {boolean} Whether to throttle attempts
 */
export const shouldThrottleAttempts = (
  tracker: GridAttemptTracker, 
  minInterval: number = 1000
): boolean => {
  const now = Date.now();
  return now - tracker.lastAttemptTime < minInterval;
};
