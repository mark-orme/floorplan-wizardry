
/**
 * Grid throttling module
 * Provides utilities for managing grid creation frequency
 * @module grid/gridThrottling
 */
import { gridManager } from "../gridManager";
import logger from "../logger";

/**
 * Default minimum time between grid creation attempts
 * @constant {number}
 */
const MIN_THROTTLE_INTERVAL = 1000; // 1 second

/**
 * Check if grid creation should be throttled
 * Prevents too many grid creations in a short time period
 * 
 * @returns {boolean} Whether grid creation should be throttled
 */
export const shouldThrottleCreation = (): boolean => {
  const now = Date.now();
  const timeSinceLastAttempt = now - gridManager.lastAttemptTime;
  
  // Check if we need to throttle
  if (timeSinceLastAttempt < gridManager.throttleInterval) {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Grid creation throttled (${timeSinceLastAttempt}ms < ${gridManager.throttleInterval}ms)`);
    }
    return true;
  }
  
  return false;
};

/**
 * Update throttling state after a grid creation attempt
 * Records the attempt time for future throttling checks
 */
export const recordGridCreationAttempt = (): void => {
  gridManager.lastAttemptTime = Date.now();
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Grid creation attempt recorded at ${gridManager.lastAttemptTime}`);
  }
};

/**
 * Update throttling state after successful grid creation
 * Records success time and resets consecutive reset counter
 */
export const recordSuccessfulGridCreation = (): void => {
  gridManager.lastCreationTime = Date.now();
  gridManager.consecutiveResets = 0;
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Successful grid creation recorded at ${gridManager.lastCreationTime}`);
  }
};

/**
 * Calculate adaptive throttle interval based on creation success rate
 * Increases throttling when failures occur, reduces when successful
 * 
 * @param {boolean} wasSuccessful - Whether the last creation was successful
 * @returns {number} Updated throttle interval in milliseconds
 */
export const calculateAdaptiveThrottleInterval = (wasSuccessful: boolean): number => {
  const baseInterval = MIN_THROTTLE_INTERVAL;
  const currentInterval = gridManager.throttleInterval;
  
  if (wasSuccessful) {
    // Gradually reduce throttle interval after success (min 500ms)
    const reducedInterval = Math.max(500, currentInterval * 0.8);
    gridManager.throttleInterval = reducedInterval;
    return reducedInterval;
  } else {
    // Increase throttle interval after failure (max 5000ms)
    const increasedInterval = Math.min(5000, currentInterval * 1.5);
    gridManager.throttleInterval = increasedInterval;
    return increasedInterval;
  }
};
