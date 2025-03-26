
/**
 * Hook for tracking canvas state
 * @module hooks/canvas-initialization/useCanvasStateTracking
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import logger from '@/utils/logger';
import { 
  canInitializeCanvas, 
  trackInitializationAttempt,
  getInitializationState,
  resetInitializationState
} from '@/utils/canvas/safeCanvasInitialization';

/**
 * Hook for tracking canvas initialization state
 * @returns State tracking utilities
 */
export const useCanvasStateTracking = () => {
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [initializationError, setInitializationError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const componentMountedRef = useRef(true);
  const timeoutRefs = useRef<number[]>([]);
  const isInitialized = useRef(false);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      componentMountedRef.current = false;
      clearInitTimeouts();
    };
  }, []);
  
  // Track an initialization attempt
  const recordInitializationAttempt = useCallback(() => {
    const newCount = trackInitializationAttempt();
    setAttemptCount(newCount);
    return newCount;
  }, []);
  
  // Mark initialization as complete
  const markInitializationComplete = useCallback((success: boolean) => {
    if (!componentMountedRef.current) return;
    setInitializationComplete(success);
    setInitializationError(!success);
    isInitialized.current = success;
    logger.info(`Canvas initialization ${success ? 'completed successfully' : 'failed'}`);
  }, []);
  
  // Start initialization process
  const startInitialization = useCallback(() => {
    if (!componentMountedRef.current) return;
    isInitialized.current = false;
    setInitializationComplete(false);
    setInitializationError(false);
  }, []);
  
  // Complete initialization successfully
  const completeInitialization = useCallback(() => {
    if (!componentMountedRef.current) return;
    markInitializationComplete(true);
  }, [markInitializationComplete]);
  
  // Fail initialization
  const failInitialization = useCallback((reason: string) => {
    if (!componentMountedRef.current) return;
    logger.error(`Canvas initialization failed: ${reason}`);
    markInitializationComplete(false);
  }, [markInitializationComplete]);
  
  // Set disposal state
  const setDisposalState = useCallback((disposed: boolean) => {
    if (!componentMountedRef.current) return;
  }, []);
  
  // Set initialization timeout
  const setInitTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      if (componentMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutRefs.current.push(timeoutId);
    return timeoutId;
  }, []);
  
  // Clear all initialization timeouts
  const clearInitTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(id => window.clearTimeout(id));
    timeoutRefs.current = [];
  }, []);
  
  // Setup mounted tracking
  const setupMountedTracking = useCallback(() => {
    componentMountedRef.current = true;
    return () => {
      componentMountedRef.current = false;
    };
  }, []);
  
  // Check if max attempts are exceeded
  const hasExceededMaxAttempts = useCallback(() => {
    return attemptCount >= 5;
  }, [attemptCount]);
  
  // Reset error state
  const resetErrorState = useCallback(() => {
    if (!componentMountedRef.current) return;
    setInitializationError(false);
  }, []);
  
  // Check if we can initialize the canvas
  const canInitialize = useCallback(() => {
    return canInitializeCanvas();
  }, []);
  
  // Reset initialization tracking
  const resetInitializationTracking = useCallback(() => {
    resetInitializationState();
    setAttemptCount(0);
    setInitializationComplete(false);
    setInitializationError(false);
    isInitialized.current = false;
  }, []);
  
  // Get the full initialization state
  const getState = useCallback(() => {
    return {
      initializationComplete,
      initializationError,
      attemptCount,
      isInitialized: isInitialized.current,
      ...getInitializationState()
    };
  }, [initializationComplete, initializationError, attemptCount]);
  
  return {
    initializationComplete,
    initializationError,
    attemptCount,
    isInitialized,
    componentMountedRef,
    startInitialization,
    completeInitialization,
    failInitialization,
    setDisposalState,
    getInitializationState,
    setInitTimeout,
    clearInitTimeouts,
    setupMountedTracking,
    hasExceededMaxAttempts,
    recordInitializationAttempt,
    markInitializationComplete,
    canInitialize,
    getState,
    resetErrorState,
    resetInitializationTracking
  };
};
