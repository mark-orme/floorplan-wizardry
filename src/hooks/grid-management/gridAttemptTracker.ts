
/**
 * Grid attempt tracker utilities
 * @module hooks/grid-management/gridAttemptTracker
 */

/**
 * Interface for tracking grid creation attempts
 */
export interface GridAttemptTracker {
  initialAttempted: boolean;
  totalAttempts: number;
  successfulAttempts: number;
  lastError: string | null;
}

/**
 * Create a new grid attempt tracker
 * @returns {GridAttemptTracker} New tracker instance
 */
export const createGridAttemptTracker = (): GridAttemptTracker => ({
  initialAttempted: false,
  totalAttempts: 0,
  successfulAttempts: 0,
  lastError: null
});

/**
 * Mark initial attempt as completed
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @returns {GridAttemptTracker} Updated tracker state
 */
export const markInitialAttempted = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  initialAttempted: true
});

/**
 * Increment total attempts counter
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @returns {GridAttemptTracker} Updated tracker state
 */
export const incrementTotalAttempts = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  totalAttempts: tracker.totalAttempts + 1
});

/**
 * Increment successful attempts counter
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @returns {GridAttemptTracker} Updated tracker state
 */
export const incrementSuccessfulAttempts = (tracker: GridAttemptTracker): GridAttemptTracker => ({
  ...tracker,
  successfulAttempts: tracker.successfulAttempts + 1
});

/**
 * Set last error message
 * @param {GridAttemptTracker} tracker - Current tracker state
 * @param {string} error - Error message
 * @returns {GridAttemptTracker} Updated tracker state
 */
export const setLastError = (tracker: GridAttemptTracker, error: string): GridAttemptTracker => ({
  ...tracker,
  lastError: error
});
