
/**
 * Custom hook for tracking canvas performance metrics including frame drops
 * Combines load time tracking and frame metrics
 * @module useCanvasPerformance
 */
import { useCallback } from "react";
import { useLoadTimeTracker } from "./performance/useLoadTimeTracker";
import { useFrameMetrics } from "./performance/useFrameMetrics";
import type { CanvasLoadTimes, PerformanceMetrics } from "@/types/performanceTypes";

/**
 * Hook for tracking canvas performance metrics and frame drops
 * Provides comprehensive performance monitoring for canvas operations
 * 
 * @returns {Object} Performance tracking state and functions
 * 
 * @example
 * const { 
 *   loadTimes, 
 *   markCanvasReady, 
 *   performanceMetrics,
 *   startPerformanceTracking 
 * } = useCanvasPerformance();
 */
export const useCanvasPerformance = () => {
  /**
   * Extract load time tracking functions and state
   */
  const {
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetLoadTimers
  } = useLoadTimeTracker();

  /**
   * Extract frame metrics tracking functions and state
   */
  const {
    performanceMetrics,
    startPerformanceTracking,
    stopPerformanceTracking,
    recordFrame,
    updateMetrics,
    resetPerformanceMetrics
  } = useFrameMetrics();

  /**
   * Reset all performance timers for new measurements
   * Clears both load times and frame metrics
   */
  const resetPerformanceTimers = useCallback(() => {
    resetLoadTimers();
    resetPerformanceMetrics();
  }, [resetLoadTimers, resetPerformanceMetrics]);

  return { 
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetPerformanceTimers,
    performanceMetrics,
    startPerformanceTracking,
    stopPerformanceTracking,
    recordFrame,
    updateMetrics
  };
};
