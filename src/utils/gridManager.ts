
/**
 * Grid management utilities
 * @module utils/gridManager
 */

// Flag to track if grid creation is in progress
let gridCreationInProgress = false;

// Track current grid creation operation
let gridOperationId = 0;
let activeGridObjects: any[] = [];

/**
 * Reset grid creation progress flag
 * Use this to break any stuck locks
 */
export const resetGridProgress = (): void => {
  console.log("Resetting grid creation progress flag");
  gridCreationInProgress = false;
};

/**
 * Set grid creation progress flag
 * @param {boolean} value - Progress flag value
 */
export const setGridProgress = (value: boolean): void => {
  gridCreationInProgress = value;
};

/**
 * Check if grid creation is in progress
 * @returns {boolean} True if grid creation is in progress
 */
export const isGridCreationInProgress = (): boolean => {
  return gridCreationInProgress;
};

/**
 * Start grid creation operation
 * @returns {boolean} True if operation started, false if already in progress
 */
export const startGridCreation = (): boolean => {
  if (gridCreationInProgress) {
    return false;
  }
  
  gridCreationInProgress = true;
  gridOperationId = Date.now();
  return true;
};

/**
 * Finish grid creation operation
 * @param {string} instanceId - Instance identifier
 * @param {any[]} gridObjects - Created grid objects
 */
export const finishGridCreation = (instanceId: string, gridObjects: any[]): void => {
  gridCreationInProgress = false;
  activeGridObjects = gridObjects;
  console.log(`Grid creation completed for ${instanceId} with ${gridObjects.length} objects`);
};

/**
 * Handle grid creation error
 * @param {Error} error - Error that occurred
 */
export const handleGridCreationError = (error: Error): void => {
  gridCreationInProgress = false;
  console.error("Grid creation error:", error);
};
