
/**
 * Hook for tracking canvas state
 * @module hooks/canvas-initialization/useCanvasStateTracking
 */
import { useState, useCallback, useEffect } from 'react';
import logger from '@/utils/logger';
import { 
  canInitializeCanvas, 
  trackInitializationAttempt,
  getInitializationState
} from '@/utils/canvas/safeCanvasInitialization';

/**
 * Hook for tracking canvas initialization state
 * @returns State tracking utilities
 */
export const useCanvasStateTracking = () => {
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [initializationError, setInitializationError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Track an initialization attempt
  const recordInitializationAttempt = useCallback(() => {
    const newCount = trackInitializationAttempt();
    setAttemptCount(newCount);
    return newCount;
  }, []);
  
  // Mark initialization as complete
  const markInitializationComplete = useCallback((success: boolean) => {
    setInitializationComplete(success);
    setInitializationError(!success);
    logger.info(`Canvas initialization ${success ? 'completed successfully' : 'failed'}`);
  }, []);
  
  // Check if we can initialize the canvas
  const canInitialize = useCallback(() => {
    return canInitializeCanvas();
  }, []);
  
  // Get the full initialization state
  const getState = useCallback(() => {
    return {
      initializationComplete,
      initializationError,
      attemptCount,
      ...getInitializationState()
    };
  }, [initializationComplete, initializationError, attemptCount]);
  
  // Reset error state
  const resetErrorState = useCallback(() => {
    setInitializationError(false);
  }, []);
  
  return {
    initializationComplete,
    initializationError,
    attemptCount,
    recordInitializationAttempt,
    markInitializationComplete,
    canInitialize,
    getState,
    resetErrorState
  };
};
