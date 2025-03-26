
/**
 * Hook for tracking canvas initialization state
 * @module useCanvasStateTracking
 */
import { useCallback, useRef } from "react";
import logger from "@/utils/logger";

interface InitializationState {
  attempts: number;
  initializationInProgress: boolean;
  canvasDisposalInProgress: boolean;
  isInitialized: boolean;
  lastAttemptTime: number;
}

/**
 * Hook to track canvas initialization state
 * Prevents parallel initialization and handles cleanup
 */
export const useCanvasStateTracking = () => {
  const componentMountedRef = useRef<boolean>(true);
  const stateRef = useRef<InitializationState>({
    attempts: 0,
    initializationInProgress: false,
    canvasDisposalInProgress: false,
    isInitialized: false,
    lastAttemptTime: 0
  });
  const timeoutIdsRef = useRef<number[]>([]);
  const MAX_ATTEMPTS = 5;
  
  /**
   * Check if initialization has completed
   */
  const isInitialized = useCallback((): boolean => {
    return stateRef.current.isInitialized;
  }, []);
  
  /**
   * Setup tracking of component mount state 
   */
  const setupMountedTracking = useCallback((): (() => void) => {
    componentMountedRef.current = true;
    
    return () => {
      componentMountedRef.current = false;
    };
  }, []);
  
  /**
   * Get current initialization state
   */
  const getInitializationState = useCallback((): InitializationState => {
    return { ...stateRef.current };
  }, []);
  
  /**
   * Set canvas disposal state
   */
  const setDisposalState = useCallback((isDisposing: boolean): void => {
    stateRef.current.canvasDisposalInProgress = isDisposing;
  }, []);
  
  /**
   * Start the initialization process and track attempt
   */
  const startInitialization = useCallback((): number => {
    stateRef.current.initializationInProgress = true;
    stateRef.current.attempts += 1;
    stateRef.current.lastAttemptTime = Date.now();
    logger.info(`Starting initialization attempt ${stateRef.current.attempts}`);
    return stateRef.current.attempts;
  }, []);
  
  /**
   * Mark initialization as complete
   */
  const completeInitialization = useCallback((error?: Error): void => {
    stateRef.current.initializationInProgress = false;
    stateRef.current.isInitialized = true;
    
    if (error) {
      logger.error("Initialization completed with error:", error);
    } else {
      logger.info("Initialization completed successfully");
    }
  }, []);
  
  /**
   * Mark initialization as failed
   */
  const failInitialization = useCallback((error?: Error): void => {
    stateRef.current.initializationInProgress = false;
    
    if (error) {
      logger.error("Initialization failed with error:", error);
    } else {
      logger.warn("Initialization failed");
    }
  }, []);
  
  /**
   * Check if max initialization attempts have been exceeded
   */
  const hasExceededMaxAttempts = useCallback((): boolean => {
    return stateRef.current.attempts >= MAX_ATTEMPTS;
  }, []);
  
  /**
   * Set a timeout for retrying initialization
   */
  const setInitTimeout = useCallback((callback: () => void, delay: number): void => {
    const id = window.setTimeout(() => {
      callback();
      
      // Remove the timeout ID from the array after execution
      timeoutIdsRef.current = timeoutIdsRef.current.filter(timeoutId => timeoutId !== id);
    }, delay);
    
    timeoutIdsRef.current.push(id);
  }, []);
  
  /**
   * Clear all initialization timeouts
   */
  const clearInitTimeouts = useCallback((): void => {
    timeoutIdsRef.current.forEach(id => {
      window.clearTimeout(id);
    });
    
    timeoutIdsRef.current = [];
  }, []);
  
  return {
    isInitialized,
    componentMountedRef,
    startInitialization,
    completeInitialization,
    failInitialization,
    setDisposalState,
    getInitializationState,
    hasExceededMaxAttempts,
    setInitTimeout,
    clearInitTimeouts,
    setupMountedTracking
  };
};
