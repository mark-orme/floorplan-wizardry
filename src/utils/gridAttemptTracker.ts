
/**
 * Grid attempt tracking utilities
 * Tracks grid creation attempts and provides state management
 * @module gridAttemptTracker
 */

/**
 * Track grid creation attempt status
 */
export interface GridAttemptStatus {
  /** Count of creation attempts */
  count: number;
  /** Maximum number of attempts to try */
  maxAttempts: number;
  /** Flag to track if initial grid creation was attempted */
  initialAttempted: boolean;
  /** Flag to track if grid creation was successful */
  creationSuccessful: boolean;
}

/**
 * Create a new grid attempt tracker
 * @returns {GridAttemptStatus} Initial grid attempt status
 */
export const createGridAttemptTracker = (): GridAttemptStatus => ({
  count: 0,
  maxAttempts: 12,
  initialAttempted: false,
  creationSuccessful: false
});

/**
 * Increment attempt count and check if max attempts reached
 * @param {GridAttemptStatus} status - Current grid attempt status
 * @returns {GridAttemptStatus} Updated status
 */
export const incrementAttemptCount = (status: GridAttemptStatus): GridAttemptStatus => ({
  ...status,
  count: status.count + 1
});

/**
 * Mark grid creation as successful
 * @param {GridAttemptStatus} status - Current grid attempt status
 * @returns {GridAttemptStatus} Updated status
 */
export const markCreationSuccessful = (status: GridAttemptStatus): GridAttemptStatus => ({
  ...status,
  creationSuccessful: true
});

/**
 * Mark initial grid attempt as complete
 * @param {GridAttemptStatus} status - Current grid attempt status
 * @returns {GridAttemptStatus} Updated status
 */
export const markInitialAttempted = (status: GridAttemptStatus): GridAttemptStatus => ({
  ...status,
  initialAttempted: true
});

/**
 * Check if maximum attempts have been reached
 * @param {GridAttemptStatus} status - Current grid attempt status
 * @returns {boolean} True if max attempts reached
 */
export const isMaxAttemptsReached = (status: GridAttemptStatus): boolean => 
  status.count >= status.maxAttempts;
