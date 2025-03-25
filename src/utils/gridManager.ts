
/**
 * Grid manager utility
 * Provides centralized management of grid creation state
 * @module gridManager
 */

/**
 * Grid creation progress tracking
 */
export const gridManager = {
  /** Whether grid creation is currently in progress */
  creationInProgress: false,
  
  /** Number of consecutive reset attempts */
  consecutiveResets: 0,
  
  /** Maximum allowed consecutive resets before throttling */
  maxConsecutiveResets: 5,
  
  /** Last timestamp of grid creation attempt */
  lastAttemptTime: 0,
  
  /** Last timestamp of grid creation completion */
  lastCreationTime: 0,
  
  /** Whether the grid currently exists */
  exists: false,
  
  /** Safety timeout period in milliseconds */
  safetyTimeout: 5000,
  
  /** Throttle interval in milliseconds */
  throttleInterval: 2000,
  
  /** Minimum recreation interval in milliseconds */
  minRecreationInterval: 60000,
  
  /** Maximum number of allowed recreations */
  maxRecreations: 20,
  
  /** Total number of creation attempts */
  totalCreations: 0,
  
  /** Last dimensions used for grid creation */
  lastDimensions: { width: 0, height: 0 },
  
  /** Creation lock information */
  creationLock: {
    id: 0,
    timestamp: 0,
    isLocked: false
  }
};

/**
 * Start a grid creation process
 * Prevents concurrent grid creations
 * 
 * @returns {boolean} Whether the creation was allowed to start
 */
export const startGridCreation = (): boolean => {
  if (gridManager.creationInProgress) {
    return false;
  }
  
  gridManager.creationInProgress = true;
  gridManager.lastAttemptTime = Date.now();
  
  return true;
};

/**
 * Complete a grid creation process
 * Updates tracking state after successful creation
 */
export const completeGridCreation = (): void => {
  gridManager.creationInProgress = false;
  gridManager.consecutiveResets = 0;
};

/**
 * Reset grid creation progress
 * Typically used when grid creation fails or needs to be retried
 */
export const resetGridProgress = (): void => {
  if (gridManager.creationInProgress) {
    gridManager.consecutiveResets += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Grid creation progress reset, consecutive resets: ${gridManager.consecutiveResets}`);
    }
  }
  
  gridManager.creationInProgress = false;
};

/**
 * Schedule a grid progress reset after a timeout
 * Useful for preventing stuck creation states
 * 
 * @param {number} timeout - Timeout in milliseconds
 * @returns {number} The timeout ID
 */
export const scheduleGridProgressReset = (timeout: number): number => {
  return window.setTimeout(() => {
    resetGridProgress();
  }, timeout);
};

/**
 * Acquire a lock for grid creation
 * Prevents concurrent grid creations
 * 
 * @returns {boolean} Whether the lock was acquired
 */
export const acquireGridCreationLock = (): boolean => {
  if (gridManager.creationLock.isLocked) {
    return false;
  }
  
  gridManager.creationLock.isLocked = true;
  gridManager.creationLock.id = Date.now();
  gridManager.creationLock.timestamp = Date.now();
  
  return true;
};

/**
 * Release a grid creation lock
 * Allows other operations to proceed
 * 
 * @param {number} lockId - The ID of the lock to release
 * @returns {boolean} Whether the lock was released
 */
export const releaseGridCreationLock = (lockId: number): boolean => {
  if (gridManager.creationLock.id !== lockId) {
    // Only the lock owner can release it
    return false;
  }
  
  gridManager.creationLock.isLocked = false;
  return true;
};

/**
 * Check if grid creation should be throttled
 * Based on recent creation attempts
 * 
 * @returns {boolean} Whether creation should be throttled
 */
export const shouldThrottleCreation = (): boolean => {
  const now = Date.now();
  
  // If we've had too many consecutive resets, throttle creation
  if (gridManager.consecutiveResets >= gridManager.maxConsecutiveResets) {
    return now - gridManager.lastAttemptTime < gridManager.throttleInterval;
  }
  
  return false;
};

/**
 * Check if grid creation is currently allowed
 * Based on throttling and concurrency limits
 * 
 * @returns {boolean} Whether grid creation is allowed
 */
export const canCreateGrid = (): boolean => {
  // Prevent creating if already in progress
  if (gridManager.creationInProgress) {
    return false;
  }
  
  // Check if we need to throttle due to too many resets
  if (gridManager.consecutiveResets >= gridManager.maxConsecutiveResets) {
    // Only allow after a cooldown period (5 seconds)
    const now = Date.now();
    if (now - gridManager.lastAttemptTime < 5000) {
      return false;
    }
  }
  
  return true;
};
