
/**
 * Grid attempt tracker module
 * Manages tracking of grid creation attempts
 * @module grid-management/gridAttemptTracker
 */
import { GridAttemptTracker } from "./types";

/**
 * Create a new grid attempt tracker
 * @returns {GridAttemptTracker} New grid attempt tracker
 */
export const createGridAttemptTracker = (): GridAttemptTracker => ({
  initialAttempted: false,
  count: 0,
  maxAttempts: 5,
  successful: false
});

/**
 * Mark initial grid creation as attempted
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @returns {GridAttemptTracker} Updated tracker
 */
export const markInitialAttempted = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  initialAttempted: true
});

/**
 * Increment the attempt count
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @returns {GridAttemptTracker} Updated tracker
 */
export const incrementAttemptCount = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  count: tracker.count + 1
});

/**
 * Mark grid creation as successful
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @returns {GridAttemptTracker} Updated tracker
 */
export const markCreationSuccessful = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  successful: true
});

/**
 * Check if maximum attempts have been reached
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @returns {boolean} Whether max attempts reached
 */
export const isMaxAttemptsReached = (tracker: GridAttemptTracker): boolean => {
  return tracker.count >= tracker.maxAttempts;
};
