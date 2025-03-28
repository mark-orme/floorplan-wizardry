
/**
 * Grid manager module
 * Manages grid creation state and throttling
 * @module gridManager
 */
import { GRID_CREATION_COOLDOWN } from "./grid/constants";

// Grid manager state
interface GridManagerState {
  lastGridCreationTime: number;
  gridCreationInProgress: boolean;
  createAttempt: number;
  safetyTimeout: number | null;
  
  // Required properties for grid management
  lastAttemptTime: number;
  throttleInterval: number;
  lastCreationTime: number;
  consecutiveResets: number;
  creationLock: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  };
}

// Initialize grid manager state
export const gridManager: GridManagerState = {
  lastGridCreationTime: 0,
  gridCreationInProgress: false,
  createAttempt: 0,
  safetyTimeout: null,
  
  // Initialize with default values
  lastAttemptTime: 0,
  throttleInterval: 1000, // Default throttle interval in ms
  lastCreationTime: 0,
  consecutiveResets: 0,
  creationLock: {
    id: 0,
    timestamp: 0,
    isLocked: false
  }
};

/**
 * Check if grid creation should be throttled
 * Prevents excessive creation attempts
 * 
 * @returns {boolean} True if creation should be throttled
 */
export const shouldThrottleCreation = (): boolean => {
  const now = Date.now();
  return now - gridManager.lastGridCreationTime < GRID_CREATION_COOLDOWN;
};

/**
 * Reset grid creation progress state
 * Used to clear stuck state or prepare for a fresh attempt
 */
export const resetGridProgress = (): void => {
  gridManager.gridCreationInProgress = false;
  
  // Don't reset lastGridCreationTime to avoid immediate retries
  // Don't reset createAttempt to maintain the attempt count
  
  // Clear safety timeout if it exists
  if (gridManager.safetyTimeout !== null) {
    clearTimeout(gridManager.safetyTimeout);
    gridManager.safetyTimeout = null;
  }
  
  // Increment consecutive resets counter
  gridManager.consecutiveResets += 1;
};

/**
 * Log grid creation status
 * Only logs in development mode and throttles messages to reduce console spam
 * 
 * @param {string} message - Message to log
 * @param {any} data - Additional data to log
 */
export const logGridStatus = (message: string, data?: any): void => {
  // Only log in development and limit frequency to reduce spam
  if (process.env.NODE_ENV !== 'development') return;
  
  const now = Date.now();
  if (now - gridManager.lastAttemptTime < 2000) return; // Only log once every 2 seconds
  
  gridManager.lastAttemptTime = now;
  console.log(`[Grid] ${message}`, data || '');
};
