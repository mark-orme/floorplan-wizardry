
/**
 * Custom hook for canvas debugging and performance monitoring
 * @module useCanvasDebug
 */
import { useState, useEffect } from "react";

interface DebugInfo {
  canvasInitialized: boolean;
  gridCreated: boolean;
  dimensionsSet: boolean;
  brushInitialized: boolean;
}

interface LoadTimes {
  startTime: number;
  canvasReady: number;
  gridCreated: number;
}

/**
 * Hook for managing debug information and performance metrics
 * @returns Debug information and setters
 */
export const useCanvasDebug = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    canvasInitialized: false,
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false
  });
  
  const [loadTimes, setLoadTimes] = useState<LoadTimes>({
    startTime: performance.now(),
    canvasReady: 0,
    gridCreated: 0
  });
  
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Track debug info changes for performance metrics
  useEffect(() => {
    if (debugInfo.canvasInitialized && loadTimes.canvasReady === 0) {
      setLoadTimes(prev => ({
        ...prev,
        canvasReady: performance.now() - prev.startTime
      }));
      console.log(`Canvas initialized in ${performance.now() - loadTimes.startTime}ms`);
    }
    
    if (debugInfo.gridCreated && loadTimes.gridCreated === 0) {
      setLoadTimes(prev => ({
        ...prev,
        gridCreated: performance.now() - prev.startTime
      }));
      console.log(`Grid created in ${performance.now() - loadTimes.startTime}ms`);
    }
  }, [debugInfo, loadTimes]);

  const resetLoadTimes = () => {
    setLoadTimes({
      startTime: performance.now(),
      canvasReady: 0,
      gridCreated: 0
    });
  };

  return {
    debugInfo,
    setDebugInfo,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    loadTimes,
    resetLoadTimes
  };
};
