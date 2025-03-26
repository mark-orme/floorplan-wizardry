/**
 * Hook for managing canvas initialization retry logic
 * @module useCanvasRetryLogic
 */
import { useRef, useCallback } from "react";
import logger from "@/utils/logger";

interface RetryAttemptStatus {
  shouldContinue: boolean;
  isMaxAttemptsReached: boolean;
  isCycleDetected: boolean;
}

/**
 * Hook to handle canvas initialization retry logic
 * Prevents infinite retry loops and tracks initialization attempts
 */
export const useCanvasRetryLogic = () => {
  const MAX_RETRY_ATTEMPTS = 5;
  const attemptsRef = useRef<number>(0);
  const lastTimestampsRef = useRef<number[]>([]);
  const cycleDetectedRef = useRef<boolean>(false);
  
  /**
   * Check if initialization attempts show a cycle pattern
   */
  const isCycleDetected = useCallback((): boolean => {
    return cycleDetectedRef.current;
  }, []);
  
  /**
   * Reset all initialization tracking state
   */
  const resetInitializationTracking = useCallback((): void => {
    attemptsRef.current = 0;
    lastTimestampsRef.current = [];
    cycleDetectedRef.current = false;
    logger.info("Initialization tracking reset");
  }, []);
  
  /**
   * Track an initialization attempt and determine if we should continue trying
   * @returns Status of the attempt and whether to continue
   */
  const trackInitializationAttempt = useCallback((): RetryAttemptStatus => {
    // Track this attempt
    attemptsRef.current += 1;
    const now = Date.now();
    lastTimestampsRef.current.push(now);
    
    // Keep only the last 10 timestamps
    if (lastTimestampsRef.current.length > 10) {
      lastTimestampsRef.current = lastTimestampsRef.current.slice(-10);
    }
    
    // Check for a cycle (rapid consecutive attempts)
    if (lastTimestampsRef.current.length >= 3) {
      const timestamps = lastTimestampsRef.current;
      const intervals = [];
      
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i-1]);
      }
      
      // If we have at least 3 very similar intervals (within 100ms), that's a cycle
      let similarIntervals = 0;
      for (let i = 1; i < intervals.length; i++) {
        if (Math.abs(intervals[i] - intervals[i-1]) < 100) {
          similarIntervals++;
        }
      }
      
      if (similarIntervals >= 2) {
        logger.warn("Initialization cycle detected!");
        cycleDetectedRef.current = true;
        return {
          shouldContinue: false,
          isMaxAttemptsReached: false,
          isCycleDetected: true
        };
      }
    }
    
    // Check max attempts
    if (attemptsRef.current > MAX_RETRY_ATTEMPTS) {
      logger.warn(`Max initialization attempts (${MAX_RETRY_ATTEMPTS}) reached`);
      return {
        shouldContinue: false,
        isMaxAttemptsReached: true,
        isCycleDetected: false
      };
    }
    
    // Otherwise, we can continue attempting
    return {
      shouldContinue: true,
      isMaxAttemptsReached: false,
      isCycleDetected: false
    };
  }, []);
  
  return {
    trackInitializationAttempt,
    resetInitializationTracking,
    isCycleDetected
  };
};
