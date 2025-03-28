
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
}

// Initialize grid manager state
export const gridManager: GridManagerState = {
  lastGridCreationTime: 0,
  gridCreationInProgress: false,
  createAttempt: 0,
  safetyTimeout: null
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
};
