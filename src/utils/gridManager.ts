
/**
 * Grid manager utilities
 * Manages grid state and locking mechanisms
 * @module gridManager
 */

/**
 * Global grid manager object to track grid state
 */
export const gridManager = {
  exists: false,
  creating: false,
  consecutiveResets: 0,
  lastDimensions: { width: 0, height: 0 }
};

/**
 * Acquire a lock for grid creation to prevent concurrent creation attempts
 * @returns {boolean} Whether lock was acquired
 */
export const acquireGridCreationLock = (): boolean => {
  if (gridManager.creating) {
    return false;
  }
  gridManager.creating = true;
  return true;
};

/**
 * Release grid creation lock
 */
export const releaseGridCreationLock = (): void => {
  gridManager.creating = false;
};

/**
 * Reset grid progress tracking
 * Useful when starting fresh after errors
 */
export const resetGridProgress = (): void => {
  gridManager.creating = false;
  gridManager.consecutiveResets += 1;
};
