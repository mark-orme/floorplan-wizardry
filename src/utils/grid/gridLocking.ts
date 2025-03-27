
/**
 * Grid locking module
 * Manages grid creation lock mechanism to prevent concurrent operations
 * @module grid/gridLocking
 */
import { gridManager } from "../gridManager";
import logger from "../logger";

/**
 * Maximum age for a lock before it's considered stale (milliseconds)
 * @constant {number}
 */
const MAX_LOCK_AGE = 10000; // 10 seconds

/**
 * Default lock ID for unlocked state
 * @constant {number}
 */
const DEFAULT_LOCK_ID = 0;

/**
 * Default timestamp for unlocked state
 * @constant {number}
 */
const DEFAULT_TIMESTAMP = 0;

/**
 * Probability factor for lock ID generation
 * @constant {number}
 */
const LOCK_ID_FACTOR = 1000000;

/**
 * Log message constants for consistent messaging
 * @constant {Object}
 */
const LOG_MESSAGES = {
  /**
   * Message when breaking a stale lock
   * @constant {string}
   */
  STALE_LOCK_BREAK: "Breaking stale grid creation lock",
  
  /**
   * Message when lock is acquired
   * @constant {string}
   */
  LOCK_ACQUIRED: "Grid creation lock acquired",
  
  /**
   * Message when lock release is attempted with wrong ID
   * @constant {string}
   */
  WRONG_LOCK_ID: "Attempted to release grid lock with incorrect ID",
  
  /**
   * Message when lock is successfully released
   * @constant {string}
   */
  LOCK_RELEASED: "Grid creation lock released"
};

/**
 * Acquire lock for grid creation
 * Prevents multiple concurrent grid creation operations
 * 
 * @returns {boolean} Whether lock was successfully acquired
 */
export const acquireGridCreationLock = (): boolean => {
  const now = Date.now();
  
  // Check if lock is already held
  if (gridManager.creationLock.isLocked) {
    // Check if the lock is stale (too old)
    if (now - gridManager.creationLock.timestamp > MAX_LOCK_AGE) {
      if (process.env.NODE_ENV === 'development') {
        logger.warn(LOG_MESSAGES.STALE_LOCK_BREAK, gridManager.creationLock);
      }
      // Break the stale lock
      releaseGridCreationLock(gridManager.creationLock.id);
    } else {
      // Lock is valid and still active
      return false;
    }
  }
  
  // Generate a new unique lock ID (random number)
  const newLockId = Math.floor(Math.random() * LOCK_ID_FACTOR);
  
  // Acquire the lock
  gridManager.creationLock = {
    id: newLockId,
    timestamp: now,
    isLocked: true
  };
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug(LOG_MESSAGES.LOCK_ACQUIRED, gridManager.creationLock);
  }
  
  return true;
};

/**
 * Release grid creation lock
 * Allows other operations to acquire the lock
 * 
 * @param {number} lockId - ID of the lock to release
 * @returns {boolean} Whether the lock was released
 */
export const releaseGridCreationLock = (lockId: number): boolean => {
  // Verify lock ID matches
  if (gridManager.creationLock.id !== lockId) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(LOG_MESSAGES.WRONG_LOCK_ID, {
        actual: gridManager.creationLock.id,
        attempted: lockId
      });
    }
    return false;
  }
  
  // Release the lock
  gridManager.creationLock = {
    id: DEFAULT_LOCK_ID,
    timestamp: DEFAULT_TIMESTAMP,
    isLocked: false
  };
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug(LOG_MESSAGES.LOCK_RELEASED);
  }
  
  return true;
};

/**
 * Check if grid creation is currently locked
 * Verifies lock status and age
 * 
 * @returns {boolean} Whether grid creation is locked
 */
export const isGridCreationLocked = (): boolean => {
  const now = Date.now();
  
  // Check if lock exists and is not stale
  if (gridManager.creationLock.isLocked && 
      (now - gridManager.creationLock.timestamp <= MAX_LOCK_AGE)) {
    return true;
  }
  
  return false;
};

/**
 * Check if a specific lock is valid and active
 * Validates lock ID, status and age
 * 
 * @param {number} lockId - ID of the lock to check
 * @returns {boolean} Whether the specified lock is valid
 */
export const isValidLock = (lockId: number): boolean => {
  const now = Date.now();
  
  return (
    gridManager.creationLock.isLocked &&
    gridManager.creationLock.id === lockId &&
    (now - gridManager.creationLock.timestamp <= MAX_LOCK_AGE)
  );
};
