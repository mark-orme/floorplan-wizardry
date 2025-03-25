
/**
 * Custom hook for tracking canvas performance metrics
 * @module useCanvasPerformance
 */
import { useState, useRef } from "react";
import { type CanvasLoadTimes } from "@/types/drawingTypes";

/**
 * Hook for tracking canvas initialization and performance metrics
 * @returns Performance tracking state and marker functions
 */
export const useCanvasPerformance = () => {
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
  const markCanvasReady = () => {
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
  };

  /**
   * Mark the grid as created and record the time
   */
  const markGridCreated = () => {
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
  };

  /**
   * Reset performance timers for new measurements
   */
  const resetPerformanceTimers = () => {
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
  };

  return { 
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetPerformanceTimers
  };
};
