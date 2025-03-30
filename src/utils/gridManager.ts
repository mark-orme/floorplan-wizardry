
/**
 * Grid manager utility
 * Tracks grid creation progress and state
 */

/**
 * Grid creation progress state
 */
let gridCreationInProgress = false;
let gridCreationAttempt = 0;
let gridCreationSuccess = false;

/**
 * Reset grid creation progress
 */
export const resetGridProgress = (): void => {
  gridCreationInProgress = false;
  gridCreationAttempt = 0;
  gridCreationSuccess = false;
};

/**
 * Set grid creation in progress
 * @returns {boolean} Whether state was changed
 */
export const setGridCreationInProgress = (): boolean => {
  if (gridCreationInProgress) return false;
  
  gridCreationInProgress = true;
  gridCreationAttempt++;
  return true;
};

/**
 * Set grid creation as complete
 * @param {boolean} success - Whether creation was successful
 */
export const setGridCreationComplete = (success: boolean): void => {
  gridCreationInProgress = false;
  gridCreationSuccess = success;
};

/**
 * Get current grid creation state
 * @returns Grid creation state object
 */
export const getGridCreationState = () => ({
  inProgress: gridCreationInProgress,
  attempt: gridCreationAttempt,
  success: gridCreationSuccess
});
