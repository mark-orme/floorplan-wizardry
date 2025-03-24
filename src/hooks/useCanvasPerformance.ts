
/**
 * Custom hook for tracking canvas performance metrics
 * @module useCanvasPerformance
 */
import { useState, useRef } from "react";

export interface CanvasLoadTimes {
  startTime: number;
  canvasReady: number;
  gridCreated: number;
}

/**
 * Hook for tracking canvas initialization and performance metrics
 * @returns Performance tracking state and marker functions
 */
export const useCanvasPerformance = () => {
  const [loadTimes, setLoadTimes] = useState<CanvasLoadTimes>({
    startTime: performance.now(),
    canvasReady: 0,
    gridCreated: 0
  });
  
  // Track if grid creation has been marked already
  const gridCreatedRef = useRef(false);

  /**
   * Mark the canvas as ready and record the time
   */
  const markCanvasReady = () => {
    if (loadTimes.canvasReady === 0) {
      setLoadTimes(prev => ({ 
        ...prev, 
        canvasReady: performance.now() - prev.startTime 
      }));
      console.log(`Canvas initialized in ${performance.now() - loadTimes.startTime}ms`);
    }
  };

  /**
   * Mark the grid as created and record the time
   */
  const markGridCreated = () => {
    if (!gridCreatedRef.current && loadTimes.gridCreated === 0) {
      setLoadTimes(prev => ({ 
        ...prev, 
        gridCreated: performance.now() - prev.startTime 
      }));
      gridCreatedRef.current = true;
      console.log(`Grid created in ${performance.now() - loadTimes.startTime}ms`);
    }
  };

  /**
   * Reset performance timers for new measurements
   */
  const resetPerformanceTimers = () => {
    gridCreatedRef.current = false;
    setLoadTimes({
      startTime: performance.now(),
      canvasReady: 0,
      gridCreated: 0
    });
  };

  return { 
    loadTimes,
    markCanvasReady,
    markGridCreated,
    resetPerformanceTimers
  };
};
