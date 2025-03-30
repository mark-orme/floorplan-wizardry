
/**
 * Grid management utilities
 * @module utils/gridManager
 */

// Flag to track if grid creation is in progress
let gridCreationInProgress = false;

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
