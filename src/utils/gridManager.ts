
/**
 * Grid manager module for grid creation and lifecycle
 * Handles grid creation state, flags, and limits to prevent simultaneous updates
 * Provides lock mechanisms to avoid race conditions during grid creation
 * @module gridManager
 */
import { GridManagerState, CanvasDimensions } from "@/types/drawingTypes";

/**
 * Track grid creation state globally with proper typing
 * Contains configuration, locks, and state tracking for grid creation
 */
export const gridManager: GridManagerState = {
  // Creation time tracking
  lastCreationTime: 0,
  inProgress: false,
  
  // Dimensions tracking
  lastDimensions: { width: 0, height: 0 },
  
  // Initialization state
  initialized: false,
  totalCreations: 0,
  
  // Configuration
  maxRecreations: 3,
  minRecreationInterval: 60000, // 1 minute
  throttleInterval: 120000,     // 2 minutes
  
  // Grid state
  exists: false,
  
  // Batch processing state
  batchTimeoutId: null,
  
  // Safety timeout (ms) to reset inProgress if creation takes too long
  safetyTimeout: 5000,
  
  // Flags to prevent race conditions
  lastResetTime: 0,
  consecutiveResets: 0,
  maxConsecutiveResets: 3,
  
  // Track creation locks with timestamp
  creationLock: {
    id: 0,
    timestamp: 0,
    isLocked: false
  }
};

/**
 * Reset the grid creation in-progress flag
 * Used to prevent grid creation from getting stuck in a locked state
 * Provides safety mechanism for recovering from stalled grid creation
 */
export const resetGridProgress = (): void => {
  const now = Date.now();
  
  // Check for rapid consecutive resets which might indicate a problem
  if (now - gridManager.lastResetTime < 500) {
    gridManager.consecutiveResets++;
    console.log(`Consecutive grid reset #${gridManager.consecutiveResets}`);
    
    // If too many rapid resets, we might be in a reset loop
    if (gridManager.consecutiveResets > gridManager.maxConsecutiveResets) {
      console.warn("Too many consecutive resets detected, adding delay");
      setTimeout(() => {
        gridManager.inProgress = false;
        gridManager.creationLock.isLocked = false;
        gridManager.consecutiveResets = 0;
      }, 1000);
      return;
    }
  } else {
    // Reset the counter if enough time has passed
    gridManager.consecutiveResets = 0;
  }
  
  gridManager.lastResetTime = now;
  gridManager.inProgress = false;
  gridManager.creationLock.isLocked = false;
  console.log("Grid creation progress flag reset");
};

/**
 * Acquire a lock for grid creation
 * Prevents multiple simultaneous grid creation attempts
 * Includes safety timeout for stale locks
 * 
 * @returns {boolean} Whether the lock was acquired successfully
 */
export const acquireGridCreationLock = (): boolean => {
  const now = Date.now();
  
  // Check if lock is active
  if (gridManager.creationLock.isLocked) {
    // If lock has been held for too long, force release it
    if (now - gridManager.creationLock.timestamp > gridManager.safetyTimeout) {
      console.warn("Forcing release of stale grid creation lock");
      gridManager.creationLock.isLocked = false;
    } else {
      // Lock is active and not stale
      return false;
    }
  }
  
  // Acquire the lock
  gridManager.creationLock.id++;
  gridManager.creationLock.timestamp = now;
  gridManager.creationLock.isLocked = true;
  gridManager.inProgress = true;
  
  return true;
};

/**
 * Release the grid creation lock
 * Allows other operations to acquire the lock after this one completes
 * Validates lock ID to prevent releasing someone else's lock
 * 
 * @param {number} lockId - ID of the lock to release
 * @returns {boolean} Whether the lock was released successfully
 */
export const releaseGridCreationLock = (lockId: number): boolean => {
  // Only release if the ID matches (prevent releasing someone else's lock)
  if (lockId === 0 || gridManager.creationLock.id === lockId) {
    gridManager.creationLock.isLocked = false;
    gridManager.inProgress = false;
    return true;
  }
  return false;
};

/**
 * Force grid progress reset after a safety timeout
 * Ensures grid creation doesn't get permanently stuck
 * 
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {number} Timeout ID for cancellation if needed
 */
export const scheduleGridProgressReset = (timeoutMs = 5000): number => {
  return window.setTimeout(() => {
    console.log("Scheduled grid progress reset executed");
    resetGridProgress();
  }, timeoutMs);
};

