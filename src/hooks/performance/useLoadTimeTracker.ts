
/**
 * Hook for tracking canvas and grid load times
 * @module useLoadTimeTracker
 */
import { useState, useRef, useCallback } from "react";
import { type CanvasLoadTimes } from "@/types/performanceTypes";

/**
 * Hook for tracking canvas initialization and grid creation times
 * @returns Load time tracking state and functions
 */
export const useLoadTimeTracker = () => {
  const [loadTimes, setLoadTimes] = useState<CanvasLoadTimes>({
    startTime: performance.now(),
    canvasInitStart: 0,
    canvasInitEnd: 0,
    gridCreationStart: 0,
    gridCreationEnd: 0,
    totalLoadTime: 0,
    canvasReady: false,
    gridCreated: false
  });
  
  // Track if grid creation has been marked already
  const gridCreatedRef = useRef(false);

  /**
   * Mark the canvas as ready and record the time
   */
  const markCanvasReady = useCallback(() => {
    if (!loadTimes.canvasReady) {
      const timeElapsed = performance.now() - loadTimes.startTime;
      setLoadTimes(prev => ({ 
        ...prev, 
        canvasReady: true,
        canvasInitEnd: timeElapsed,
        totalLoadTime: timeElapsed
      }));
      console.log(`Canvas initialized in ${timeElapsed}ms`);
    }
  }, [loadTimes.canvasReady, loadTimes.startTime]);

  /**
   * Mark the grid as created and record the time
   */
  const markGridCreated = useCallback(() => {
    if (!gridCreatedRef.current && !loadTimes.gridCreated) {
      const timeElapsed = performance.now() - loadTimes.startTime;
      setLoadTimes(prev => ({ 
        ...prev, 
        gridCreated: true,
        gridCreationEnd: timeElapsed,
        totalLoadTime: timeElapsed
      }));
      gridCreatedRef.current = true;
      console.log(`Grid created in ${timeElapsed}ms`);
    }
  }, [loadTimes.gridCreated, loadTimes.startTime]);

  /**
   * Reset performance timers for new measurements
   */
  const resetLoadTimers = useCallback(() => {
    gridCreatedRef.current = false;
    setLoadTimes({
      startTime: performance.now(),
      canvasInitStart: 0,
      canvasInitEnd: 0,
      gridCreationStart: 0,
      gridCreationEnd: 0,
      totalLoadTime: 0,
      canvasReady: false,
      gridCreated: false
    });
  }, []);

  return {
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetLoadTimers
  };
};
