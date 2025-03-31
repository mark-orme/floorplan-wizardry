
/**
 * Hook for error handling in the canvas controller
 * @module useCanvasControllerErrorHandling
 */
import { useCallback } from "react";
import { DebugInfoState } from "@/types/core/DebugInfo";

interface UseCanvasControllerErrorHandlingProps {
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  updateDebugInfo: (info: Partial<DebugInfoState>) => void;
}

/**
 * Hook that handles errors in the canvas controller
 * @returns Error handling functions
 */
export const useCanvasControllerErrorHandling = (props: UseCanvasControllerErrorHandlingProps) => {
  const {
    setHasError,
    setErrorMessage,
    updateDebugInfo
  } = props;

  // Handle error
  const handleError = useCallback((error: Error) => {
    console.error("Canvas error:", error);
    setHasError(true);
    setErrorMessage(error.message);
    
    // Create a proper update object that conforms to Partial<DebugInfoState>
    updateDebugInfo({
      performanceStats: {
        // This is optional in DebugInfoState, so we can safely increment it
        errorCount: 1 // Default to 1 if not previously set
      }
    });
  }, [setHasError, setErrorMessage, updateDebugInfo]);

  // Handle retry attempt
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
    
    // Create a proper update object that conforms to Partial<DebugInfoState>
    updateDebugInfo({
      performanceStats: {
        // These are optional in DebugInfoState, so we can safely update them
        retryCount: 1 // Default to 1 if not previously set
      },
      lastInitTime: Date.now()
    });
  }, [setHasError, setErrorMessage, updateDebugInfo]);

  return {
    handleError,
    handleRetry
  };
};
