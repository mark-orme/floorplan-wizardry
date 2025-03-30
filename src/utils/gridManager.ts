
/**
 * Grid Manager
 * Manages grid creation state to prevent duplicate creation
 * @module utils/gridManager
 */

// Track if grid creation is in progress
let gridCreationInProgress = false;

/**
 * Check if grid creation is in progress
 * @returns {boolean} True if grid creation is in progress
 */
export const isGridCreationInProgress = (): boolean => gridCreationInProgress;

/**
 * Set grid creation progress state
 * @param {boolean} inProgress - Whether grid creation is in progress
 */
export const setGridProgress = (inProgress: boolean): void => {
  gridCreationInProgress = inProgress;
};

/**
 * Reset grid creation progress
 * Sets grid creation progress to false
 */
export const resetGridProgress = (): void => {
  gridCreationInProgress = false;
};
