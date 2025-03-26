
/**
 * Custom hook for canvas initialization retry logic
 * Handles initialization attempts and backoff strategies
 * @module useCanvasRetryLogic
 */
import { useRef, useCallback } from "react";
import logger from "@/utils/logger";

// Constants for retry configuration
const MAX_CONSECUTIVE_INITIALIZATIONS = 3;
const MAX_GLOBAL_INIT_ATTEMPTS = 5;

/**
 * Interface for tracking canvas initialization attempts
 */
interface CanvasInitAttemptTracker {
  consecutiveInitializations: number;
  globalInitAttempts: number;
  canvasInitializationCycleDetected: boolean;
}

/**
 * Hook for managing canvas initialization retry logic
 * @returns Functions and state for managing initialization retries
 */
export const useCanvasRetryLogic = () => {
  // Create ref to track attempt state that persists between renders
  const attemptTracker = useRef<CanvasInitAttemptTracker>({
    consecutiveInitializations: 0,
    globalInitAttempts: 0,
    canvasInitializationCycleDetected: false
  });
  
  /**
   * Track a new initialization attempt
   * @returns Object with information about attempt status
   */
  const trackInitializationAttempt = useCallback(() => {
    // First, increment global attempt counter
    attemptTracker.current.globalInitAttempts++;
    
    // Log the current attempt
    console.log(`🔄 Canvas initialization attempt #${attemptTracker.current.globalInitAttempts}`);
    
    // Check if we've exceeded the global maximum attempts
    if (attemptTracker.current.globalInitAttempts > MAX_GLOBAL_INIT_ATTEMPTS) {
      logger.error(`Too many global initialization attempts (${attemptTracker.current.globalInitAttempts}), blocking further attempts`);
      return { 
        shouldContinue: false, 
        isCycleDetected: false,
        isMaxAttemptsReached: true
      };
    }
    
    // Detect initialization cycles and break them
    attemptTracker.current.consecutiveInitializations++;
    if (attemptTracker.current.consecutiveInitializations > MAX_CONSECUTIVE_INITIALIZATIONS) {
      logger.warn("Initialization cycle detected, breaking the loop");
      attemptTracker.current.canvasInitializationCycleDetected = true;
      attemptTracker.current.consecutiveInitializations = 0;
      
      return { 
        shouldContinue: false, 
        isCycleDetected: true,
        isMaxAttemptsReached: false
      };
    }
    
    return { 
      shouldContinue: true,
      isCycleDetected: false,
      isMaxAttemptsReached: false
    };
  }, []);
  
  /**
   * Reset attempt counters after successful initialization
   */
  const resetInitializationTracking = useCallback(() => {
    // Reset consecutive initializations counter on success
    attemptTracker.current.consecutiveInitializations = 0;
    
    // Reset global attempts counter on success
    attemptTracker.current.globalInitAttempts = 0;
    
    // Reset cycle detection flag
    attemptTracker.current.canvasInitializationCycleDetected = false;
  }, []);
  
  /**
   * Check if initialization cycle was previously detected
   * @returns Whether a cycle was detected
   */
  const isCycleDetected = useCallback(() => {
    return attemptTracker.current.canvasInitializationCycleDetected;
  }, []);
  
  /**
   * Get current attempt counts for debugging
   */
  const getAttemptCounts = useCallback(() => {
    return {
      consecutive: attemptTracker.current.consecutiveInitializations,
      global: attemptTracker.current.globalInitAttempts,
      cycleDetected: attemptTracker.current.canvasInitializationCycleDetected
    };
  }, []);

  return {
    trackInitializationAttempt,
    resetInitializationTracking,
    isCycleDetected,
    getAttemptCounts
  };
};
