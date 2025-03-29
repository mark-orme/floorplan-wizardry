
/**
 * Grid throttling utilities
 * @module grid/gridThrottling
 */

// Import from gridManager directly
import { resetGridProgress } from "../gridManager";

// Track throttling state
let lastCreationTime = 0;
const THROTTLE_INTERVAL = 1000; // 1 second

/**
 * Check if grid creation should be throttled
 * @returns {boolean} Whether creation should be throttled
 */
export const shouldThrottleCreation = (): boolean => {
  const now = Date.now();
  const timeSinceLastCreation = now - lastCreationTime;
  
  if (timeSinceLastCreation < THROTTLE_INTERVAL) {
    console.log(`Grid creation throttled (${timeSinceLastCreation}ms since last creation)`);
    return true;
  }
  
  // Update last creation time
  lastCreationTime = now;
  return false;
};

/**
 * Reset throttling state
 */
export const resetThrottling = (): void => {
  lastCreationTime = 0;
  resetGridProgress();
};

/**
 * Get time until next allowed grid creation
 * @returns {number} Time until next allowed creation in ms
 */
export const getTimeUntilNextCreation = (): number => {
  const now = Date.now();
  const timeSinceLastCreation = now - lastCreationTime;
  
  if (timeSinceLastCreation >= THROTTLE_INTERVAL) {
    return 0;
  }
  
  return THROTTLE_INTERVAL - timeSinceLastCreation;
};
