
/**
 * Grid manager module for grid creation and lifecycle
 * Handles grid creation state, flags, and limits
 * @module gridManager
 */

// Track grid creation state globally
export const gridManager = {
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
  batchTimeoutId: null as number | null,
  
  // Safety timeout (ms) to reset inProgress if creation takes too long
  safetyTimeout: 5000,
  
  // Flags to prevent race conditions
  lastResetTime: 0,
  consecutiveResets: 0,
  maxConsecutiveResets: 3
};

/**
 * Reset the grid creation in-progress flag
 * Used to prevent grid creation from getting stuck
 */
export const resetGridProgress = () => {
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
  console.log("Grid creation progress flag reset");
};

/**
 * Force grid progress reset after a safety timeout
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {number} Timeout ID
 */
export const scheduleGridProgressReset = (timeoutMs = 5000): number => {
  return window.setTimeout(() => {
    console.log("Scheduled grid progress reset executed");
    resetGridProgress();
  }, timeoutMs);
};

