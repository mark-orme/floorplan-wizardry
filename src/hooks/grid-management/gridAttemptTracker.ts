
/**
 * Grid creation attempt tracker
 * Tracks and manages grid creation attempts
 * @module hooks/grid-management/gridAttemptTracker
 */

/**
 * Grid attempt tracker interface
 */
export interface GridAttemptTracker {
  /** Number of attempts made */
  attemptCount: number;
  /** Maximum allowed attempts */
  maxAttempts: number;
  /** Whether the last attempt was successful */
  lastAttemptSuccessful: boolean;
  /** Timestamp of last attempt */
  lastAttemptTime: number;
  /** Whether initial attempt has been made */
  initialAttempted: boolean;
  /** Total attempts counter */
  totalAttempts: number;
  /** Successful attempts counter */
  successfulAttempts: number;
  /** Last error message */
  lastError: string | null;
}

/**
 * Create a new grid attempt tracker
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {GridAttemptTracker} New grid attempt tracker
 */
export const createGridAttemptTracker = (maxAttempts: number = 3): GridAttemptTracker => {
  return {
    attemptCount: 0,
    maxAttempts,
    lastAttemptSuccessful: false,
    lastAttemptTime: 0,
    initialAttempted: false,
    totalAttempts: 0,
    successfulAttempts: 0,
    lastError: null
  };
};

/**
 * Increment attempt count
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const incrementAttemptCount = (tracker: GridAttemptTracker): GridAttemptTracker => {
  return {
    ...tracker,
    attemptCount: tracker.attemptCount + 1,
    lastAttemptTime: Date.now()
  };
};

/**
 * Mark creation as successful
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const markCreationSuccessful = (tracker: GridAttemptTracker): GridAttemptTracker => {
  return {
    ...tracker,
    lastAttemptSuccessful: true
  };
};

/**
 * Reset tracker
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @returns {GridAttemptTracker} Reset tracker
 */
export const resetTracker = (tracker: GridAttemptTracker): GridAttemptTracker => {
  return {
    ...tracker,
    attemptCount: 0,
    lastAttemptSuccessful: false
  };
};

/**
 * Check if maximum attempts reached
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @returns {boolean} True if max attempts reached
 */
export const isMaxAttemptsReached = (tracker: GridAttemptTracker): boolean => {
  return tracker.attemptCount >= tracker.maxAttempts;
};

/**
 * Check if cooldown period has passed
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @param {number} cooldownMs - Cooldown in milliseconds
 * @returns {boolean} True if cooldown period has passed
 */
export const isCooldownPassed = (tracker: GridAttemptTracker, cooldownMs: number = 1000): boolean => {
  return Date.now() - tracker.lastAttemptTime > cooldownMs;
};

/**
 * Mark initial attempt as completed
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const markInitialAttempted = (tracker: GridAttemptTracker): GridAttemptTracker => {
  return {
    ...tracker,
    initialAttempted: true
  };
};

/**
 * Increment total attempts counter
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const incrementTotalAttempts = (tracker: GridAttemptTracker): GridAttemptTracker => {
  return {
    ...tracker,
    totalAttempts: tracker.totalAttempts + 1
  };
};

/**
 * Increment successful attempts counter
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @returns {GridAttemptTracker} Updated tracker
 */
export const incrementSuccessfulAttempts = (tracker: GridAttemptTracker): GridAttemptTracker => {
  return {
    ...tracker,
    successfulAttempts: tracker.successfulAttempts + 1
  };
};

/**
 * Set last error message
 * @param {GridAttemptTracker} tracker - Grid attempt tracker
 * @param {string} errorMessage - Error message
 * @returns {GridAttemptTracker} Updated tracker
 */
export const setLastError = (tracker: GridAttemptTracker, errorMessage: string): GridAttemptTracker => {
  return {
    ...tracker,
    lastError: errorMessage
  };
};
