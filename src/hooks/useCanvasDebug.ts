
/**
 * Custom hook for canvas debugging and performance monitoring
 * @module useCanvasDebug
 */
import { useState, useEffect } from "react";
import { useCanvasPerformance } from "./useCanvasPerformance";
import { type DebugInfoState } from "@/types/drawingTypes";

/**
 * Hook for managing debug information and performance metrics
 * @returns Debug information and setters
 */
export const useCanvasDebug = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    canvasInitialized: false,
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false,
    // Add missing properties from DebugInfoState
    gridCreationAttempts: 0,
    gridCreationFailures: 0,
    lastGridCreationTime: 0,
    lastError: null,
    lastErrorTime: 0,
    canvasObjects: 0,
    gridObjects: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    gridVisible: true,
    performanceStats: {}
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
