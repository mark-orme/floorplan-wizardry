
/**
 * Custom hook for canvas debugging and performance monitoring
 * @module useCanvasDebug
 */
import { useState, useEffect } from "react";
import { useCanvasPerformance } from "./useCanvasPerformance";

interface DebugInfo {
  canvasInitialized: boolean;
  gridCreated: boolean;
  dimensionsSet: boolean;
  brushInitialized: boolean;
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
  
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Use the dedicated performance hook
  const { loadTimes, markCanvasReady, markGridCreated, resetPerformanceTimers } = useCanvasPerformance();

  // Track debug info changes for performance metrics
  useEffect(() => {
    if (debugInfo.canvasInitialized) {
      markCanvasReady();
    }
    
    if (debugInfo.gridCreated) {
      markGridCreated();
    }
  }, [debugInfo, markCanvasReady, markGridCreated]);

  const resetLoadTimes = () => {
    resetPerformanceTimers();
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
