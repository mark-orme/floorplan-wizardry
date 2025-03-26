
/**
 * Hook for Canvas Retry Logic
 * Handles retry attempts for canvas initialization
 * @module hooks/canvas-initialization/useCanvasRetryLogic
 */
import { useCallback, useRef, useState } from 'react';
import logger from '@/utils/logger';
import { 
  resetInitializationState,
  trackInitializationAttempt,
  canInitializeCanvas,
  getInitializationState
} from '@/utils/canvas/safeCanvasInitialization';

/**
 * Hook for managing canvas initialization retry logic
 * @returns Retry utilities and state tracking
 */
export const useCanvasRetryLogic = () => {
  const [retryCount, setRetryCount] = useState(0);
  const retryTimerRef = useRef<number | null>(null);
  const maxRetries = 3;
  
  /**
   * Attempt to retry canvas initialization with exponential backoff
   * @returns {boolean} True if retry will be attempted
   */
  const retryWithBackoff = useCallback(() => {
    // Clear any existing timer
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    
    // Check if we're allowed to initialize
    if (!canInitializeCanvas()) {
      logger.warn('Canvas initialization blocked, cannot retry');
      return false;
    }
    
    // Check if we've exceeded max retries
    if (retryCount >= maxRetries) {
      logger.warn(`Maximum retry count (${maxRetries}) reached`);
      return false;
    }
    
    // Calculate delay with exponential backoff
    const delay = Math.min(1000 * Math.pow(1.5, retryCount), 10000);
    
    // Schedule retry
    retryTimerRef.current = window.setTimeout(() => {
      logger.info(`Retrying canvas initialization (attempt ${retryCount + 1})`);
      setRetryCount(prev => prev + 1);
      trackInitializationAttempt();
      retryTimerRef.current = null;
    }, delay);
    
    return true;
  }, [retryCount]);
  
  /**
   * Reset retry counter and state
   */
  const resetRetry = useCallback(() => {
    // Clear any existing timer
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    
    setRetryCount(0);
    resetInitializationState();
  }, []);
  
  /**
   * Get current initialization state
   */
  const getRetryState = useCallback(() => {
    return {
      retryCount,
      initState: getInitializationState(),
      canRetry: retryCount < maxRetries && canInitializeCanvas()
    };
  }, [retryCount]);
  
  return {
    retryWithBackoff,
    resetRetry,
    retryCount,
    maxRetries,
    getRetryState
  };
};
