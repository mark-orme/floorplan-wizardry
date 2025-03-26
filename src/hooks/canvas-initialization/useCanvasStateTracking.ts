
/**
 * Hook for tracking canvas initialization state
 * Manages the lifecycle of canvas initialization attempts
 * @module useCanvasStateTracking
 */
import { useCallback, useRef } from "react";
import logger from "@/utils/logger";

/**
 * State interface for canvas initialization tracking
 * @interface InitializationState
 */
interface InitializationState {
  /** Number of initialization attempts */
  attempts: number;
  /** Whether initialization is currently in progress */
  initializationInProgress: boolean;
  /** Whether canvas disposal is currently in progress */
  canvasDisposalInProgress: boolean;
  /** Whether the canvas is fully initialized */
  isInitialized: boolean;
  /** Timestamp of the last initialization attempt */
  lastAttemptTime: number;
}

/**
 * Hook to track canvas initialization state
 * Prevents parallel initialization and handles cleanup
 * Provides utilities for tracking initialization progress and retries
 * 
 * @returns {Object} Canvas state tracking utilities
 * 
 * @example
 * const {
 *   isInitialized,
 *   startInitialization,
 *   completeInitialization,
 *   hasExceededMaxAttempts
 * } = useCanvasStateTracking();
 * 
 * // Track initialization state
 * if (!isInitialized() && !hasExceededMaxAttempts()) {
 *   startInitialization();
 *   // Initialization logic
 *   completeInitialization();
 * }
 */
export const useCanvasStateTracking = () => {
  /**
   * Reference to track if component is mounted
   * Prevents operations after component unmount
   * @type {React.MutableRefObject<boolean>}
   */
  const componentMountedRef = useRef<boolean>(true);
  
  /**
   * Reference to track initialization state
   * @type {React.MutableRefObject<InitializationState>}
   */
  const stateRef = useRef<InitializationState>({
    attempts: 0,
    initializationInProgress: false,
    canvasDisposalInProgress: false,
    isInitialized: false,
    lastAttemptTime: 0
  });
  
  /**
   * Reference to store timeout IDs for cleanup
   * @type {React.MutableRefObject<number[]>}
   */
  const timeoutIdsRef = useRef<number[]>([]);
  
  /**
   * Maximum number of initialization attempts
   * @constant {number}
   */
  const MAX_ATTEMPTS = 5;
  
  /**
   * Check if initialization has completed
   * @returns {boolean} True if canvas is initialized
   */
  const isInitialized = useCallback((): boolean => {
    return stateRef.current.isInitialized;
  }, []);
  
  /**
   * Setup tracking of component mount state 
   * @returns {Function} Cleanup function for useEffect
   */
  const setupMountedTracking = useCallback((): (() => void) => {
    componentMountedRef.current = true;
    
    return () => {
      componentMountedRef.current = false;
    };
  }, []);
  
  /**
   * Get current initialization state
   * @returns {InitializationState} Current initialization state
   */
  const getInitializationState = useCallback((): InitializationState => {
    return { ...stateRef.current };
  }, []);
  
  /**
   * Set canvas disposal state
   * @param {boolean} isDisposing - Whether canvas is being disposed
   */
  const setDisposalState = useCallback((isDisposing: boolean): void => {
    stateRef.current.canvasDisposalInProgress = isDisposing;
  }, []);
  
  /**
   * Start the initialization process and track attempt
   * @returns {number} Current attempt number
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
   * @param {Error} [error] - Optional error if initialization completed with error
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
   * @param {Error} [error] - Optional error that caused initialization to fail
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
   * @returns {boolean} True if max attempts exceeded
   */
  const hasExceededMaxAttempts = useCallback((): boolean => {
    return stateRef.current.attempts >= MAX_ATTEMPTS;
  }, []);
  
  /**
   * Set a timeout for retrying initialization
   * @param {Function} callback - Function to call after timeout
   * @param {number} delay - Delay in milliseconds
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
   * Prevents pending initialization operations
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
