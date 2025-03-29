
/**
 * Grid locking utilities
 * @module grid/gridLocking
 */

// Import from gridManager directly
import { resetGridProgress } from "../gridManager";

// Track lock state
let isLocked = false;
let lockTimestamp = 0;
const LOCK_TIMEOUT = 10000; // 10 seconds

/**
 * Lock grid creation
 * @param {string} reason - Reason for locking
 * @returns {boolean} Whether lock was applied
 */
export const lockGridCreation = (reason: string): boolean => {
  if (isLocked) {
    return false;
  }
  
  isLocked = true;
  lockTimestamp = Date.now();
  console.log(`Grid creation locked: ${reason}`);
  
  return true;
};

/**
 * Unlock grid creation
 * @returns {boolean} Whether unlock was successful
 */
export const unlockGridCreation = (): boolean => {
  if (!isLocked) {
    return false;
  }
  
  isLocked = false;
  lockTimestamp = 0;
  console.log("Grid creation unlocked");
  
  // Reset progress
  resetGridProgress();
  
  return true;
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
    console.log("Grid lock expired, auto-unlocking");
  }
  
  return isLocked;
};

/**
 * Get lock age in milliseconds
 * @returns {number} Lock age
 */
export const getLockAge = (): number => {
  if (!isLocked) {
    return 0;
  }
  
  return Date.now() - lockTimestamp;
};
