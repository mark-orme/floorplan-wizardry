
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
    startInitTime: performance.now(),
    canvasInitTime: 0,
    gridCreatedTime: 0,
    toolsInitTime: 0,
    readyTime: 0,
    totalInitTime: 0,
    canvasReady: false,
    gridCreated: false,
    startTime: performance.now()
  });
  
  // Track if grid creation has been marked already
  const gridCreatedRef = useRef(false);

  /**
   * Mark the canvas as ready and record the time
   */
  const markCanvasReady = useCallback(() => {
    if (!loadTimes.canvasReady) {
      const timeElapsed = performance.now() - (loadTimes.startTime || loadTimes.startInitTime);
      setLoadTimes(prev => ({ 
        ...prev, 
        canvasReady: true,
        canvasInitEnd: timeElapsed,
        totalLoadTime: timeElapsed
      }));
      console.log(`Canvas initialized in ${timeElapsed}ms`);
    }
  }, [loadTimes.canvasReady, loadTimes.startTime, loadTimes.startInitTime]);

  /**
   * Mark the grid as created and record the time
   */
  const markGridCreated = useCallback(() => {
    if (!gridCreatedRef.current && !loadTimes.gridCreated) {
      const timeElapsed = performance.now() - (loadTimes.startTime || loadTimes.startInitTime);
      setLoadTimes(prev => ({ 
        ...prev, 
        gridCreated: true,
        gridCreationEnd: timeElapsed,
        totalLoadTime: timeElapsed
      }));
      gridCreatedRef.current = true;
      console.log(`Grid created in ${timeElapsed}ms`);
    }
  }, [loadTimes.gridCreated, loadTimes.startTime, loadTimes.startInitTime]);

  /**
   * Reset performance timers for new measurements
   */
  const resetLoadTimers = useCallback(() => {
    gridCreatedRef.current = false;
    setLoadTimes({
      startInitTime: performance.now(),
      canvasInitTime: 0,
      gridCreatedTime: 0,
      toolsInitTime: 0,
      readyTime: 0,
      totalInitTime: 0,
      canvasReady: false,
      gridCreated: false,
      startTime: performance.now()
    });
  }, []);

  return {
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetLoadTimers
  };
};
