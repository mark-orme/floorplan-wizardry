/**
 * Hook for managing canvas debug information
 * @module useCanvasDebug
 */
import { useState, useCallback } from "react";
import { DebugInfoState } from "@/types/debugTypes";

/**
 * Hook that provides debug information and related functions
 * @returns Debug information state and related functions
 */
export const useCanvasDebug = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    showDebugInfo: false,
    canvasInitialized: false,
    dimensionsSet: false,
    gridCreated: false,
    brushInitialized: false,
    canvasCreated: false,
    canvasLoaded: false,
    canvasReady: false,
    canvasWidth: 0,
    canvasHeight: 0,
    lastInitTime: 0,
    lastGridCreationTime: 0,
    performanceStats: {}
  });
  
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  /**
   * Resets load times in debug info
   */
  const resetLoadTimes = useCallback(() => {
    setDebugInfo(prev => ({
      ...prev,
      lastInitTime: 0,
      lastGridCreationTime: 0
    }));
  }, []);

  return {
    debugInfo,
    setDebugInfo,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    resetLoadTimes
  };
};
