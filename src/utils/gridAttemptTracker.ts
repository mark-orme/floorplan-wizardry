
/**
 * Grid attempt tracking module
 * Keeps track of grid creation attempts and their status
 * @module gridAttemptTracker
 */

/**
 * Enumeration of grid attempt status values
 * @enum {string}
 */
export enum GridAttemptStatus {
  /** Grid creation was never attempted */
  NEVER_ATTEMPTED = 'never_attempted',
  /** Grid creation is currently in progress */
  IN_PROGRESS = 'in_progress',
  /** Grid creation succeeded */
  SUCCESS = 'success',
  /** Grid creation failed */
  FAILURE = 'failure',
  /** Grid creation was throttled */
  THROTTLED = 'throttled'
}

/**
 * Interface for tracking grid creation attempts
 * @interface GridAttemptTracker
 */
export interface GridAttemptTracker {
  /** Number of consecutive attempts */
  count: number;
  /** Maximum allowed attempts before throttling */
  maxConsecutive: number;
  /** Timestamp of last attempt */
  lastAttempt: number;
  /** Status of the last attempt */
  status: GridAttemptStatus;
  /** Error message from last failed attempt */
  lastError: string | null;
}

/**
 * Default attempt tracker config
 * @type {GridAttemptTracker}
 */
export const defaultAttemptTracker: GridAttemptTracker = {
  count: 0,
  maxConsecutive: 3,
  lastAttempt: 0,
  status: GridAttemptStatus.NEVER_ATTEMPTED,
  lastError: null
};

/**
 * Reset the grid attempt tracker to its default state
 * @param {GridAttemptTracker} tracker - The tracker to reset
 * @returns {GridAttemptTracker} The reset tracker
 */
export const resetAttemptTracker = (tracker: GridAttemptTracker): GridAttemptTracker => {
  return { ...defaultAttemptTracker };
};

/**
 * Record a new grid creation attempt
 * @param {GridAttemptTracker} tracker - The current tracker state
 * @param {GridAttemptStatus} status - The status of this attempt
 * @param {string|null} error - Optional error message
 * @returns {GridAttemptTracker} Updated tracker
 */
export const recordGridAttempt = (
  tracker: GridAttemptTracker, 
  status: GridAttemptStatus, 
  error: string | null = null
): GridAttemptTracker => {
  return {
    ...tracker,
    count: tracker.count + 1,
    lastAttempt: Date.now(),
    status,
    lastError: error
  };
};
