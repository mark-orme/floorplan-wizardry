
/**
 * Hook for managing canvas debug information
 * @module useCanvasDebug
 */
import { useState, useCallback } from "react";
import { DebugInfoState, DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";

/**
 * Hook that provides debug information and related functions
 * @returns Debug information state and related functions
 */
export const useCanvasDebug = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    ...DEFAULT_DEBUG_STATE,
    hasError: false,
    errorMessage: ''
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
    hasError: debugInfo.hasError || false,
    setHasError: (hasError: boolean) => setDebugInfo(prev => ({ ...prev, hasError })),
    errorMessage: debugInfo.errorMessage || '',
    setErrorMessage: (errorMessage: string) => setDebugInfo(prev => ({ ...prev, errorMessage })),
    resetLoadTimes
  };
};
