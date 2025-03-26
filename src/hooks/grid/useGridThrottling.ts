
/**
 * Grid throttling hook
 * Manages throttling for grid creation to prevent excessive operations
 * @module useGridThrottling
 */
import { useCallback } from "react";
import logger from "@/utils/logger";

/**
 * Minimum time between grid creation attempts in milliseconds
 * @constant {number}
 */
const MIN_THROTTLE_INTERVAL = 1000;

/**
 * Grid throttling state
 * @type {Object}
 */
let lastAttemptTime = 0;

/**
 * Hook for managing grid creation throttling
 * Prevents too many grid creation operations in a short time
 * 
 * @returns {Object} Throttling utility functions
 */
export const useGridThrottling = () => {
  /**
   * Check if grid creation should be throttled
   * Compares current time with last attempt time
   * 
   * @returns {boolean} True if creation should be throttled
   */
  const shouldThrottleCreation = useCallback((): boolean => {
    const now = Date.now();
    const shouldThrottle = now - lastAttemptTime < MIN_THROTTLE_INTERVAL;
    
    if (shouldThrottle) {
      logger.debug(`Grid creation throttled. Last attempt: ${lastAttemptTime}, Now: ${now}`);
    }
    
    return shouldThrottle;
  }, []);
  
  /**
   * Handle throttled grid creation
   * Updates the last attempt time and logs the throttling
   * Called when a creation attempt is made but throttled
   */
  const handleThrottledCreation = useCallback((): void => {
    // Update the last attempt time
    lastAttemptTime = Date.now();
    
    logger.debug("Grid creation throttled, skipping this attempt");
  }, []);
  
  /**
   * Clean up throttling state
   * Resets the last attempt time
   * Used when unmounting or resetting the component
   */
  const cleanup = useCallback((): void => {
    // Reset throttling state
    lastAttemptTime = 0;
  }, []);
  
  return {
    shouldThrottleCreation,
    handleThrottledCreation,
    cleanup
  };
};
