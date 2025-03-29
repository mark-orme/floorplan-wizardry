
/**
 * Grid manager
 * Manages grid creation process and state
 * @module gridManager
 */
import { toast } from "sonner";
import logger from "./logger";

// Global state for grid creation
let inProgress = false;
let lastAttempt = 0;
let consecutiveFailures = 0;
let isLocked = false;
let lockTimestamp = 0;

const LOCK_TIMEOUT = 10000; // 10 seconds

/**
 * Reset grid progress state
 * Used to clear stuck locks
 */
export const resetGridProgress = (): void => {
  const wasLocked = isLocked;
  
  inProgress = false;
  lastAttempt = 0;
  
  // Only reset lock if it's been locked for more than LOCK_TIMEOUT
  if (isLocked && Date.now() - lockTimestamp > LOCK_TIMEOUT) {
    isLocked = false;
    logger.info("Grid lock reset after timeout");
    console.log("Grid lock reset after timeout");
  }
  
  if (wasLocked && !isLocked) {
    toast.info("Grid creation reset");
  }
};

/**
 * Mark grid creation as started
 * @returns {boolean} Whether marking was successful
 */
export const markGridCreationStarted = (): boolean => {
  // Check if already in progress or locked
  if (inProgress) {
    console.log("Grid creation already in progress");
    return false;
  }
  
  if (isLocked) {
    const lockAge = Date.now() - lockTimestamp;
    console.log(`Grid creation locked for ${lockAge}ms`);
    
    // Auto-unlock if lock is too old
    if (lockAge > LOCK_TIMEOUT) {
      isLocked = false;
      lockTimestamp = 0;
      console.log("Grid lock expired, resetting");
    } else {
      return false;
    }
  }
  
  // Check throttling (no more than once per 1s)
  const now = Date.now();
  if (now - lastAttempt < 1000) {
    console.log(`Grid creation throttled - last attempt ${now - lastAttempt}ms ago`);
    return false;
  }
  
  // Mark as in progress
  inProgress = true;
  lastAttempt = now;
  return true;
};

/**
 * Mark grid creation as completed
 * @param {boolean} success - Whether creation was successful
 */
export const markGridCreationCompleted = (success: boolean): void => {
  inProgress = false;
  
  if (success) {
    consecutiveFailures = 0;
  } else {
    consecutiveFailures++;
    
    // Lock grid creation after too many consecutive failures
    if (consecutiveFailures >= 3) {
      isLocked = true;
      lockTimestamp = Date.now();
      logger.warn(`Grid creation locked after ${consecutiveFailures} consecutive failures`);
      console.warn(`Grid creation locked after ${consecutiveFailures} consecutive failures`);
    }
  }
};

/**
 * Check if grid creation is in progress
 * @returns {boolean} Whether grid creation is in progress
 */
export const isGridCreationInProgress = (): boolean => {
  return inProgress;
};

/**
 * Check if grid creation is locked
 * @returns {boolean} Whether grid creation is locked
 */
export const isGridCreationLocked = (): boolean => {
  // Auto-unlock if lock is too old
  if (isLocked && Date.now() - lockTimestamp > LOCK_TIMEOUT) {
    isLocked = false;
    lockTimestamp = 0;
    logger.info("Grid lock expired, auto-unlocking");
    console.log("Grid lock expired, auto-unlocking");
  }
  
  return isLocked;
};

/**
 * Get grid creation state
 * @returns {Object} Current grid creation state
 */
export const getGridCreationState = (): Record<string, any> => {
  return {
    inProgress,
    lastAttempt,
    consecutiveFailures,
    isLocked,
    lockAge: isLocked ? Date.now() - lockTimestamp : 0
  };
};
