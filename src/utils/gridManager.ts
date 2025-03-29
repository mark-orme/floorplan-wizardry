
/**
 * Grid manager 
 * Central management for grid creation and state
 * @module gridManager
 */

// Track grid creation state
let gridCreationInProgress = false;
let lastGridCreationTime = 0;
let gridCreationAttempt = 0;

/**
 * Reset grid creation progress tracking
 * Used when grid creation needs to be restarted
 */
export const resetGridProgress = (): void => {
  gridCreationInProgress = false;
  gridCreationAttempt = 0;
  console.log("Grid progress reset");
};

/**
 * Check if grid creation is already in progress
 * @returns {boolean} Whether creation is in progress
 */
export const isGridCreationInProgress = (): boolean => {
  return gridCreationInProgress;
};

/**
 * Set grid creation in progress state
 * @param {boolean} inProgress - Whether creation is in progress
 */
export const setGridCreationInProgress = (inProgress: boolean): void => {
  gridCreationInProgress = inProgress;
};

/**
 * Get time since last grid creation attempt
 * @returns {number} Time in milliseconds since last attempt
 */
export const getTimeSinceLastCreation = (): number => {
  return Date.now() - lastGridCreationTime;
};

/**
 * Update last grid creation time
 */
export const updateLastCreationTime = (): void => {
  lastGridCreationTime = Date.now();
};

/**
 * Increment grid creation attempt counter
 * @returns {number} New attempt count
 */
export const incrementCreationAttempt = (): number => {
  return ++gridCreationAttempt;
};

/**
 * Get current grid creation attempt count
 * @returns {number} Current attempt count
 */
export const getCreationAttemptCount = (): number => {
  return gridCreationAttempt;
};

/**
 * Reset grid creation attempt counter
 */
export const resetCreationAttempts = (): void => {
  gridCreationAttempt = 0;
};

/**
 * Log current grid status
 * Useful for debugging grid creation issues
 */
export const logGridStatus = (): void => {
  console.log("Grid Status:", {
    creationInProgress: gridCreationInProgress,
    lastCreationTime: new Date(lastGridCreationTime).toISOString(),
    attemptCount: gridCreationAttempt
  });
};
