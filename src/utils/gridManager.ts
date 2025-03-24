
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
  safetyTimeout: 5000
};

/**
 * Reset the grid creation in-progress flag
 * Used to prevent grid creation from getting stuck
 */
export const resetGridProgress = () => {
  gridManager.inProgress = false;
};

