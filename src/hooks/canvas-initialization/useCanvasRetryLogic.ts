/**
 * Hook for canvas initialization retry logic
 * @module hooks/canvas-initialization/useCanvasRetryLogic
 */
import { useCallback, useState, useRef } from 'react';
import logger from '@/utils/logger';
import { getInitializationState } from '@/utils/canvas/safeCanvasInitialization';

/**
 * Hook providing retry logic for canvas initialization
 * @returns Retry utilities
 */
export const useCanvasRetryLogic = () => {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = useRef(5);
  const lastRetryTime = useRef(0);
  const cycleDetection = useRef({
    errorCounts: {} as Record<string, number>,
    consecutiveErrorTypes: [] as string[]
  });
  
  /**
   * Retry with exponential backoff
   * @returns {boolean} Whether retry was attempted
   */
  const retryWithBackoff = useCallback(() => {
    if (retryCount >= maxRetries.current) {
      logger.warn(`Exceeded max retries (${maxRetries.current})`);
      return false;
    }
    
    const waitTime = Math.min(1000 * Math.pow(1.5, retryCount), 10000);
    logger.info(`Retrying canvas initialization in ${waitTime}ms (attempt ${retryCount + 1})`);
    
    setTimeout(() => {
      lastRetryTime.current = Date.now();
      setRetryCount(prev => prev + 1);
    }, waitTime);
    
    return true;
  }, [retryCount]);
  
  /**
   * Reset retry state
   */
  const resetRetry = useCallback(() => {
    setRetryCount(0);
    lastRetryTime.current = 0;
    cycleDetection.current = {
      errorCounts: {},
      consecutiveErrorTypes: []
    };
  }, []);
  
  /**
   * Track initialization attempt
   * @param {string} errorType - Type of error encountered
   * @returns {boolean} Whether this appears to be a cycle
   */
  const trackInitializationAttempt = useCallback((errorType?: string) => {
    if (errorType) {
      // Track for cycle detection
      cycleDetection.current.errorCounts[errorType] = 
        (cycleDetection.current.errorCounts[errorType] || 0) + 1;
      cycleDetection.current.consecutiveErrorTypes.push(errorType);
      
      // Keep only last 5 error types for cycle detection
      if (cycleDetection.current.consecutiveErrorTypes.length > 5) {
        cycleDetection.current.consecutiveErrorTypes.shift();
      }
    }
    
    return true;
  }, []);
  
  /**
   * Reset initialization tracking
   */
  const resetInitializationTracking = useCallback(() => {
    resetRetry();
  }, [resetRetry]);
  
  /**
   * Check if a cycle of errors is detected
   * @returns {boolean} Whether a cycle is detected
   */
  const isCycleDetected = useCallback(() => {
    const { consecutiveErrorTypes, errorCounts } = cycleDetection.current;
    
    // Detect same error happening multiple times
    for (const errorType in errorCounts) {
      if (errorCounts[errorType] >= 3) {
        return true;
      }
    }
    
    // Detect pattern of alternating errors
    if (consecutiveErrorTypes.length >= 4) {
      // Look for A-B-A-B pattern
      const a = consecutiveErrorTypes[consecutiveErrorTypes.length - 4];
      const b = consecutiveErrorTypes[consecutiveErrorTypes.length - 3];
      const c = consecutiveErrorTypes[consecutiveErrorTypes.length - 2];
      const d = consecutiveErrorTypes[consecutiveErrorTypes.length - 1];
      
      if (a === c && b === d) {
        return true;
      }
    }
    
    return false;
  }, []);
  
  /**
   * Get the retry state
   * @returns Retry state object
   */
  const getRetryState = useCallback(() => {
    return {
      retryCount,
      initState: getInitializationState(),
      canRetry: retryCount < maxRetries.current
    };
  }, [retryCount]);
  
  return {
    retryWithBackoff,
    resetRetry,
    retryCount,
    maxRetries: maxRetries.current,
    getRetryState,
    trackInitializationAttempt,
    resetInitializationTracking,
    isCycleDetected
  };
};
