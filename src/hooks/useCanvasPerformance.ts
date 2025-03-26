
/**
 * Custom hook for tracking canvas performance metrics including frame drops
 * @module useCanvasPerformance
 */
import { useCallback } from "react";
import { useLoadTimeTracker } from "./performance/useLoadTimeTracker";
import { useFrameMetrics } from "./performance/useFrameMetrics";
import type { CanvasLoadTimes, PerformanceMetrics } from "@/types/performanceTypes";

/**
 * Hook for tracking canvas performance metrics and frame drops
 * @returns Performance tracking state and functions
 */
export const useCanvasPerformance = () => {
  const {
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetLoadTimers
  } = useLoadTimeTracker();

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
