
/**
 * Safe canvas initialization utilities
 * Helps manage canvas initialization state to prevent errors
 */

/**
 * Track if canvas is being initialized
 */
let isInitializing = false;

/**
 * Get current initialization state
 * @returns {boolean} Whether canvas is initializing
 */
export const getInitializationState = (): boolean => {
  return isInitializing;
};

/**
 * Set canvas as initializing
 * @returns {boolean} Whether state was changed
 */
export const setInitializing = (): boolean => {
  if (isInitializing) return false;
  
  isInitializing = true;
  return true;
};

/**
 * Set canvas as done initializing
 */
export const setInitialized = (): void => {
  isInitializing = false;
};

/**
 * Reset initialization state
 * Used when component unmounts or needs to restart
 */
export const resetInitializationState = (): void => {
  isInitializing = false;
};
