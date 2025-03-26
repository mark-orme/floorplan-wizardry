
/**
 * Custom hook for tracking canvas initialization state
 * Handles initialization flags and progress tracking
 * @module useCanvasStateTracking
 */
import { useState, useRef, useCallback } from "react";
import logger from "@/utils/logger";

/**
 * State flags for tracking the initialization process
 */
interface InitializationStateFlags {
  isInitialized: boolean;
  initializationInProgress: boolean;
  canvasDisposalInProgress: boolean;
}

/**
 * Hook for tracking and managing canvas initialization state
 * @returns Functions and state for tracking initialization
 */
export const useCanvasStateTracking = () => {
  // Track initialization state with useState
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track component mounted state to prevent state updates after unmount
  const componentMountedRef = useRef(true);
  
  // Use ref for tracking flags that don't need to trigger renders
  const stateFlags = useRef<InitializationStateFlags>({
    isInitialized: false,
    initializationInProgress: false,
    canvasDisposalInProgress: false
  });
  
  // Initialize timeout reference
  const initTimeoutRef = useRef<number | null>(null);
  
  // Track initialization attempts for this component instance
  const initializationAttempts = useRef(0);
  const maxInitAttempts = 2; // Max attempts for this component instance
  
  /**
   * Mark initialization as in progress
   */
  const startInitialization = useCallback(() => {
    stateFlags.current.initializationInProgress = true;
    initializationAttempts.current += 1;
    
    logger.info("Starting canvas initialization");
    console.log("🚀 Starting canvas initialization attempt #", initializationAttempts.current);
    
    return initializationAttempts.current;
  }, []);
  
  /**
   * Mark initialization as complete
   */
  const completeInitialization = useCallback(() => {
    // Only update state if component is still mounted
    if (componentMountedRef.current) {
      setIsInitialized(true);
      stateFlags.current.isInitialized = true;
    }
    
    stateFlags.current.initializationInProgress = false;
    logger.info("Canvas initialization completed successfully");
  }, []);
  
  /**
   * Mark initialization as failed
   */
  const failInitialization = useCallback(() => {
    stateFlags.current.initializationInProgress = false;
    logger.info("Canvas initialization failed");
  }, []);
  
  /**
   * Track canvas disposal state
   * @param isDisposing Whether canvas is being disposed
   */
  const setDisposalState = useCallback((isDisposing: boolean) => {
    stateFlags.current.canvasDisposalInProgress = isDisposing;
  }, []);
  
  /**
   * Get current initialization state
   */
  const getInitializationState = useCallback(() => {
    return {
      isInitialized: stateFlags.current.isInitialized,
      isInitializedState: isInitialized,
      initializationInProgress: stateFlags.current.initializationInProgress,
      canvasDisposalInProgress: stateFlags.current.canvasDisposalInProgress,
      attempts: initializationAttempts.current,
      maxAttempts: maxInitAttempts
    };
  }, [isInitialized]);
  
  /**
   * Clear any pending initialization timeouts
   */
  const clearInitTimeouts = useCallback(() => {
    if (initTimeoutRef.current !== null) {
      window.clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
  }, []);
  
  /**
   * Set a new initialization timeout
   * @param callback Function to call when timeout completes
   * @param delay Timeout delay in milliseconds
   */
  const setInitTimeout = useCallback((callback: () => void, delay: number) => {
    // Clear any existing timeout first
    clearInitTimeouts();
    
    // Only set timeout if component is still mounted
    if (componentMountedRef.current) {
      initTimeoutRef.current = window.setTimeout(() => {
        if (componentMountedRef.current) {
          callback();
        }
      }, delay);
    }
  }, [clearInitTimeouts]);
  
  /**
   * Setup component mounted tracking
   * @returns Cleanup function for unmounting
   */
  const setupMountedTracking = useCallback(() => {
    // Set mounted flag to true
    componentMountedRef.current = true;
    
    // Return cleanup function
    return () => {
      componentMountedRef.current = false;
      clearInitTimeouts();
    };
  }, [clearInitTimeouts]);
  
  /**
   * Check if too many initialization attempts have been made
   */
  const hasExceededMaxAttempts = useCallback(() => {
    return initializationAttempts.current >= maxInitAttempts;
  }, []);

  return {
    isInitialized,
    componentMountedRef,
    initTimeoutRef,
    startInitialization,
    completeInitialization,
    failInitialization,
    setDisposalState,
    getInitializationState,
    setInitTimeout,
    clearInitTimeouts,
    setupMountedTracking,
    hasExceededMaxAttempts
  };
};
