
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
  batchTimeoutId: null as number | null
};

/**
 * Check if grid recreation should be throttled based on creation limits
 * @param now - Current timestamp
 * @returns Whether recreation should be throttled
 */
export const shouldThrottleGridCreation = (now: number): boolean => {
  // If within throttle interval and grid exists, throttle creation
  if (now - gridManager.lastCreationTime < gridManager.throttleInterval && gridManager.exists) {
    return true;
  }
  
  // If we've hit the max recreations, only allow one per minute
  if (gridManager.totalCreations >= gridManager.maxRecreations && 
      (now - gridManager.lastCreationTime < gridManager.minRecreationInterval)) {
    return true;
  }
  
  return false;
};

/**
 * Check if dimensions have changed significantly enough to recreate grid
 * @param oldDimensions - Previous canvas dimensions
 * @param newDimensions - Current canvas dimensions
 * @returns Whether dimensions changed enough to recreate grid
 */
export const hasDimensionsChangedSignificantly = (
  oldDimensions: { width: number, height: number },
  newDimensions: { width: number, height: number }
): boolean => {
  // Calculate dimension changes as percentage
  const widthChange = Math.abs(oldDimensions.width - newDimensions.width) / oldDimensions.width;
  const heightChange = Math.abs(oldDimensions.height - newDimensions.height) / oldDimensions.height;
  
  // Only recreate grid if dimensions change by more than 30%
  return widthChange > 0.3 || heightChange > 0.3;
};
