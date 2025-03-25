
/**
 * Grid safety module
 * Handles safety mechanisms for grid creation process
 * @module gridSafety
 */
import { gridManager, resetGridProgress, acquireGridCreationLock, releaseGridCreationLock } from "../gridManager";
import logger from "../logger";

/**
 * Setup safety reset timeout for grid creation
 * Ensures grid creation doesn't get stuck
 * 
 * @param {number} timeoutDuration - Timeout duration in milliseconds
 * @returns {number} Timeout ID
 */
export const setupGridSafetyTimeout = (
  timeoutDuration: number = 5000
): number => {
  // Schedule a safety timeout to reset the flag after specified duration
  return window.setTimeout(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.log("Grid safety timeout triggered - resetting creation state");
    }
    resetGridProgress();
  }, timeoutDuration);
};

/**
 * Acquire lock with safety timeout
 * Gets lock for grid creation and sets up safety timeout
 * 
 * @returns {{ lockId: number, safetyTimeoutId: number | null } | null} Lock info or null if couldn't acquire
 */
export const acquireGridLockWithSafety = (): { lockId: number, safetyTimeoutId: number | null } | null => {
  // CRITICAL: Force reset any existing grid lock before trying to acquire one
  resetGridProgress();
  
  // Attempt to acquire a lock for grid creation
  if (!acquireGridCreationLock()) {
    if (process.env.NODE_ENV === 'development') {
      logger.log("Grid creation already in progress (locked), skipping");
    }
    return null;
  }
  
  // Generate a unique lock ID for this creation attempt
  const lockId = gridManager.creationLock.id;
  
  // Schedule a safety timeout to reset the flag after 5 seconds
  const safetyTimeoutId = setupGridSafetyTimeout(gridManager.safetyTimeout);
  
  if (process.env.NODE_ENV === 'development') {
    logger.log("Starting grid creation with lock ID:", lockId);
  }
  
  return { lockId, safetyTimeoutId };
};

/**
 * Clean up grid creation resources
 * Clears timeouts and releases locks
 * 
 * @param {number} lockId - The lock ID to release
 * @param {number | null} safetyTimeoutId - The safety timeout ID to clear
 */
export const cleanupGridResources = (
  lockId: number,
  safetyTimeoutId: number | null
): void => {
  // Clear the safety timeout
  if (safetyTimeoutId !== null) {
    clearTimeout(safetyTimeoutId);
  }
  
  // Release the lock
  releaseGridCreationLock(lockId);
  
  if (process.env.NODE_ENV === 'development') {
    logger.log("Grid resources cleaned up, lock released:", lockId);
  }
};
