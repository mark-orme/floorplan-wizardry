
/**
 * Custom hook for canvas initialization retry logic
 * Handles initialization attempts and backoff strategies
 * @module useCanvasRetryLogic
 */
import { useCallback } from "react";
import logger from "@/utils/logger";
import { 
  trackInitializationAttempt, 
  resetInitializationState, 
  canInitializeCanvas 
} from "@/utils/canvas/safeCanvasInitialization";

/**
 * Hook for managing canvas initialization retry logic
 * @returns Functions and state for managing initialization retries
 */
export const useCanvasRetryLogic = () => {
  // Track a new initialization attempt using the global tracker
  const trackAttempt = useCallback(() => {
    // Check if initialization is allowed first
    if (!canInitializeCanvas()) {
      logger.warn("Canvas initialization blocked by safety system");
      return { 
        shouldContinue: false, 
        isCycleDetected: false,
        isMaxAttemptsReached: true
      };
    }
    
    // Track this attempt
    const status = trackInitializationAttempt();
    
    // Log the current attempt
    console.log(`🔄 Canvas initialization attempt tracked`);
    
    // Handle result based on status
    if (!status.allowed) {
      if (status.reason === "max-global-attempts") {
        logger.error(`Too many global initialization attempts (${status.globalCount}), blocking further attempts`);
        return { 
          shouldContinue: false, 
          isCycleDetected: false,
          isMaxAttemptsReached: true
        };
      }
      
      if (status.reason === "max-consecutive-attempts") {
        logger.warn("Initialization cycle detected, breaking the loop");
        
        return { 
          shouldContinue: false, 
          isCycleDetected: true,
          isMaxAttemptsReached: false
        };
      }
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
    resetInitializationState();
  }, []);
  
  /**
   * Check if initialization cycle was previously detected
   * @returns Whether a cycle was detected
   */
  const isCycleDetected = useCallback(() => {
    // We consider it a cycle if initialization is blocked
    return !canInitializeCanvas();
  }, []);
  
  return {
    trackInitializationAttempt: trackAttempt,
    resetInitializationTracking,
    isCycleDetected
  };
};
