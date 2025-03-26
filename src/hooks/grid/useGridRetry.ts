
/**
 * Grid retry hook
 * Manages retry mechanisms for grid creation
 * @module useGridRetry
 */
import { useCallback, useRef } from "react";
import logger from "@/utils/logger";

/**
 * Retry configuration constants
 * @constant {Object}
 */
const RETRY_CONSTANTS = {
  /** Base delay for exponential backoff (ms) */
  BASE_RETRY_DELAY: 500,
  
  /** Maximum number of retry attempts */
  MAX_RETRY_ATTEMPTS: 3,
  
  /** Maximum delay cap in milliseconds */
  MAX_DELAY_CAP: 3000
};

/**
 * Hook for managing grid creation retries
 * Implements exponential backoff strategy for reliability
 * 
 * @returns {Object} Retry management functions
 */
export const useGridRetry = () => {
  // Track retry timeout and attempts
  const retryTimeoutRef = useRef<number | null>(null);
  const retryAttemptsRef = useRef<number>(0);
  
  /**
   * Cancel any scheduled retry
   * Clears timeout and resets attempt counter
   */
  const cancelRetry = useCallback((): void => {
    if (retryTimeoutRef.current !== null) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Reset retry counter
    retryAttemptsRef.current = 0;
  }, []);
  
  /**
   * Schedule a retry with exponential backoff
   * Delays increase with each retry attempt
   * 
   * @param {Function} retryFunction - Function to retry
   * @param {number} [customDelay] - Optional custom delay in ms
   * @returns {boolean} Whether retry was scheduled
   */
  const scheduleRetry = useCallback((
    retryFunction: () => void,
    customDelay?: number
  ): boolean => {
    // Cancel any existing retry
    cancelRetry();
    
    // Check if max attempts reached
    if (retryAttemptsRef.current >= RETRY_CONSTANTS.MAX_RETRY_ATTEMPTS) {
      logger.warn(`Maximum retry attempts (${RETRY_CONSTANTS.MAX_RETRY_ATTEMPTS}) reached for grid creation`);
      return false;
    }
    
    // Increment retry counter
    retryAttemptsRef.current++;
    
    // Calculate delay with exponential backoff
    const calculatedDelay = customDelay || 
      Math.pow(2, retryAttemptsRef.current - 1) * RETRY_CONSTANTS.BASE_RETRY_DELAY;
    
    // Cap the delay at the maximum value
    const cappedDelay = Math.min(calculatedDelay, RETRY_CONSTANTS.MAX_DELAY_CAP);
    
    logger.debug(`Scheduling grid creation retry ${retryAttemptsRef.current}/${RETRY_CONSTANTS.MAX_RETRY_ATTEMPTS} in ${cappedDelay}ms`);
    
    // Schedule retry
    retryTimeoutRef.current = window.setTimeout(() => {
      retryTimeoutRef.current = null;
      try {
        retryFunction();
      } catch (error) {
        logger.error("Error in grid creation retry:", error);
      }
    }, cappedDelay);
    
    return true;
  }, [cancelRetry]);
  
  /**
   * Reset retry state
   * Clears timeout and resets attempt counter
   */
  const resetRetryState = useCallback((): void => {
    cancelRetry();
  }, [cancelRetry]);
  
  /**
   * Get current retry attempts count
   * @returns {number} Current retry attempts
   */
  const getRetryAttempts = useCallback((): number => {
    return retryAttemptsRef.current;
  }, []);
  
  return {
    scheduleRetry,
    cancelRetry,
    resetRetryState,
    getRetryAttempts
  };
};
