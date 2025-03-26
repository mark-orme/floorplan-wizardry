
/**
 * Hook for tracking canvas initialization state
 * Manages initialization attempts, lifecycle and debugging
 * @module useCanvasStateTracking
 */
import { useRef, useCallback } from "react";
import logger from "@/utils/logger";
import { canInitializeCanvas, trackInitializationAttempt, resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";

// State interface for initialization tracking
interface InitializationState {
  attempts: number;
  isInitialized: boolean;
  initializationInProgress: boolean;
  canvasDisposalInProgress: boolean;
  lastInitAt: number;
}

/**
 * Hook for managing canvas initialization state to prevent cycles
 * @returns Functions and state for initialization tracking
 */
export const useCanvasStateTracking = () => {
  // Use refs to track state across renders
  const timeoutsRef = useRef<number[]>([]);
  const componentMountedRef = useRef<boolean>(false);
  const stateRef = useRef<InitializationState>({
    attempts: 0,
    isInitialized: false,
    initializationInProgress: false,
    canvasDisposalInProgress: false,
    lastInitAt: 0
  });
  
  /**
   * Get current initialization state (read-only)
   * @returns Current state
   */
  const getInitializationState = useCallback((): InitializationState => {
    return { ...stateRef.current };
  }, []);
  
  /**
   * Start an initialization attempt
   * @returns Attempt number
   */
  const startInitialization = useCallback((): number => {
    // First check if initialization is allowed
    if (!canInitializeCanvas()) {
      logger.warn("Canvas initialization blocked by safety system");
      return stateRef.current.attempts;
    }
    
    // Track this attempt with the global tracker
    const status = trackInitializationAttempt();
    if (!status.allowed) {
      logger.warn(`Initialization blocked: ${status.reason}, attempt #${status.attemptCount}`);
      return stateRef.current.attempts;
    }
    
    // Update local state
    stateRef.current.attempts++;
    stateRef.current.initializationInProgress = true;
    stateRef.current.lastInitAt = Date.now();
    
    logger.info(`🚀 Starting canvas initialization attempt # ${stateRef.current.attempts}`);
    
    return stateRef.current.attempts;
  }, []);
  
  /**
   * Mark initialization as complete
   */
  const completeInitialization = useCallback(() => {
    if (stateRef.current.isInitialized) {
      return; // Already initialized
    }
    
    logger.info("Canvas initialization completed successfully");
    stateRef.current.isInitialized = true;
    stateRef.current.initializationInProgress = false;
    
    // Reset the global initialization state tracker
    resetInitializationState();
  }, []);
  
  /**
   * Mark initialization as failed
   */
  const failInitialization = useCallback(() => {
    stateRef.current.initializationInProgress = false;
    logger.warn(`Canvas initialization attempt ${stateRef.current.attempts} failed`);
  }, []);
  
  /**
   * Set canvas disposal state
   * @param {boolean} inProgress Whether disposal is in progress
   */
  const setDisposalState = useCallback((inProgress: boolean) => {
    stateRef.current.canvasDisposalInProgress = inProgress;
  }, []);
  
  /**
   * Check if max initialization attempts exceeded
   * @returns Whether max attempts exceeded
   */
  const hasExceededMaxAttempts = useCallback((): boolean => {
    const MAX_ATTEMPTS = 5;
    return stateRef.current.attempts >= MAX_ATTEMPTS;
  }, []);
  
  /**
   * Set a timeout for initialization retry
   * @param {Function} callback Function to call after timeout
   * @param {number} delay Delay in milliseconds
   */
  const setInitTimeout = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      callback();
    }, delay);
    timeoutsRef.current.push(id);
  }, []);
  
  /**
   * Clear all initialization timeouts
   */
  const clearInitTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(id => {
      window.clearTimeout(id);
    });
    timeoutsRef.current = [];
  }, []);
  
  /**
   * Track component mounted state for cleanup
   * @returns Cleanup function
   */
  const setupMountedTracking = useCallback(() => {
    componentMountedRef.current = true;
    
    return () => {
      componentMountedRef.current = false;
      clearInitTimeouts();
    };
  }, [clearInitTimeouts]);
  
  return {
    isInitialized: stateRef.current.isInitialized,
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
