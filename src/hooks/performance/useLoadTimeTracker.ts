
/**
 * Custom hook for tracking canvas load times
 * Measures various phases of canvas initialization
 * @module useLoadTimeTracker
 */
import { useState, useCallback } from "react";
import type { CanvasLoadTimes } from "@/types/performanceTypes";

/**
 * Hook for tracking and managing canvas load times
 * @returns Load time tracking state and marker functions
 */
export const useLoadTimeTracker = () => {
  // Initialize load times state with start time
  const [loadTimes, setLoadTimes] = useState<CanvasLoadTimes>({
    startInitTime: performance.now(),
  });

  /**
   * Mark when canvas is ready for interaction
   * Calculates total initialization time
   */
  const markCanvasReady = useCallback(() => {
    const readyTime = performance.now();
    
    setLoadTimes(prev => {
      // Calculate total time
      const totalInitTime = prev.startInitTime ? readyTime - prev.startInitTime : undefined;
      
      return {
        ...prev,
        readyTime,
        totalInitTime,
        canvasReady: true
      };
    });
  }, []);

  /**
   * Mark when grid is created on canvas
   */
  const markGridCreated = useCallback(() => {
    const gridCreatedTime = performance.now();
    
    setLoadTimes(prev => ({
      ...prev,
      gridCreatedTime,
      gridCreated: true
    }));
  }, []);

  /**
   * Reset all load time tracking
   * Used when reinitializing canvas
   */
  const resetLoadTimers = useCallback(() => {
    setLoadTimes({
      startInitTime: performance.now(),
    });
  }, []);

  return {
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetLoadTimers
  };
};
