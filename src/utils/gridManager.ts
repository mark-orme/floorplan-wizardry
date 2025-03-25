
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
  lastAttemptTime: 0
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
