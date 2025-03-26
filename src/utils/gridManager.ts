
/**
 * Grid manager module
 * Central module for grid state management across the application
 * @module gridManager
 */

/**
 * Grid creation state object
 * Maintains state for grid creation operations
 * @type {Object}
 */
export const gridManager = {
  /**
   * Whether grid creation is currently in progress
   * @type {boolean}
   */
  creationInProgress: false,
  
  /**
   * Count of consecutive times grid creation had to be reset
   * Used for detecting problematic grid creation cycles
   * @type {number}
   */
  consecutiveResets: 0,
  
  /**
   * Maximum allowable consecutive resets before emergency measures
   * @type {number}
   */
  maxConsecutiveResets: 5,
  
  /**
   * Timestamp of last grid creation attempt
   * Used for throttling calculations
   * @type {number}
   */
  lastAttemptTime: 0,
  
  /**
   * Timestamp of last successful grid creation
   * Used for determining grid age and recreation timing
   * @type {number}
   */
  lastCreationTime: 0,
  
  /**
   * Whether a grid already exists on the canvas
   * Prevents duplicate grid creation
   * @type {boolean}
   */
  exists: false,
  
  /**
   * Safety timeout ID for grid creation operations
   * Used to automatically release locks in case of failures
   * @type {number|null}
   */
  safetyTimeout: null,
  
  /**
   * Minimum time between grid creation attempts (ms)
   * Controls throttling frequency
   * @type {number}
   */
  throttleInterval: 1000,
  
  /**
   * Minimum time between grid recreations (ms)
   * Prevents excessive recreation during resize or other events
   * @type {number}
   */
  minRecreationInterval: 500,
  
  /**
   * Maximum recreations allowed per session
   * Prevents infinite recreation loops
   * @type {number}
   */
  maxRecreations: 100,
  
  /**
   * Total count of grid creations in current session
   * Used for tracking recreation limits
   * @type {number}
   */
  totalCreations: 0,
  
  /**
   * Last recorded canvas dimensions
   * Used to check if dimensions have changed before recreating
   * @type {Object|null}
   */
  lastDimensions: null,
  
  /**
   * Lock state for grid creation
   * Prevents concurrent grid creation operations
   * @type {Object}
   */
  creationLock: {
    /**
     * Unique identifier for current lock
     * @type {number}
     */
    id: 0,
    
    /**
     * Timestamp when lock was created
     * @type {number}
     */
    timestamp: 0,
    
    /**
     * Whether the lock is currently active
     * @type {boolean}
     */
    isLocked: false
  }
};

/**
 * Check if grid creation should be throttled
 * @returns {boolean} Whether creation should be throttled
 */
export const shouldThrottleCreation = (): boolean => {
  const now = Date.now();
  return now - gridManager.lastAttemptTime < gridManager.throttleInterval;
};

/**
 * Reset grid creation progress state
 * Used when cleaning up grid creation or handling failures
 */
export const resetGridProgress = (): void => {
  // Increment consecutive reset counter
  gridManager.consecutiveResets++;
  
  // Reset creation in progress flag
  gridManager.creationInProgress = false;
  
  // Clear any existing safety timeout
  if (gridManager.safetyTimeout !== null) {
    clearTimeout(gridManager.safetyTimeout);
    gridManager.safetyTimeout = null;
  }
  
  // Reset lock if it exists
  if (gridManager.creationLock.isLocked) {
    gridManager.creationLock = {
      id: 0,
      timestamp: 0,
      isLocked: false
    };
  }
};

/**
 * Acquire a lock for grid creation
 * @returns {boolean} Whether the lock was acquired
 */
export const acquireGridCreationLock = (): boolean => {
  if (gridManager.creationLock.isLocked) {
    // Lock already held
    return false;
  }
  
  // Generate a unique lock ID and acquire the lock
  const lockId = Math.floor(Math.random() * 1000000);
  gridManager.creationLock = {
    id: lockId,
    timestamp: Date.now(),
    isLocked: true
  };
  
  return true;
};

/**
 * Release a grid creation lock
 * @param {number} lockId - ID of the lock to release
 * @returns {boolean} Whether the lock was successfully released
 */
export const releaseGridCreationLock = (lockId: number): boolean => {
  // Check if the lock ID matches
  if (gridManager.creationLock.id !== lockId) {
    return false;
  }
  
  // Release the lock
  gridManager.creationLock = {
    id: 0,
    timestamp: 0,
    isLocked: false
  };
  
  return true;
};
