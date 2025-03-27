
/**
 * Hook for managing canvas debug information
 * @module useCanvasDebug
 */
import { useState, useCallback } from "react";
import { DebugInfoState } from "@/types";

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
    gridObjectCount: 0,
    canvasDimensions: { width: 0, height: 0 },
    hasError: false,
    errorMessage: "",
    performanceStats: {}
  });
  
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
    hasError: debugInfo.hasError,
    setHasError: (hasError: boolean) => setDebugInfo(prev => ({ ...prev, hasError })),
    errorMessage: debugInfo.errorMessage,
    setErrorMessage: (errorMessage: string) => setDebugInfo(prev => ({ ...prev, errorMessage })),
    resetLoadTimes
  };
};
