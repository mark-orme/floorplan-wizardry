
/**
 * Hook for error handling in the canvas controller
 * @module useCanvasControllerErrorHandling
 */
import { useCallback } from "react";
import { DebugInfoState } from "@/types";

interface UseCanvasControllerErrorHandlingProps {
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  updateDebugInfo: (info: Partial<DebugInfoState>) => void;
}

interface UpdateDebugInfoObject {
  errorCount?: number;
  lastRetryTime?: string;
  retryCount?: number;
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
    
    // Create a proper update object
    const updateObject: UpdateDebugInfoObject = { 
      errorCount: 1 // Default to 1 if not previously set
    };
    
    updateDebugInfo(updateObject);
  }, [setHasError, setErrorMessage, updateDebugInfo]);

  // Handle retry attempt
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
    
    // Create a proper update object
    const updateObject: UpdateDebugInfoObject = { 
      lastRetryTime: new Date().toISOString(),
      retryCount: 1 // Default to 1 if not previously set
    };
    
    updateDebugInfo(updateObject);
  }, [setHasError, setErrorMessage, updateDebugInfo]);

  return {
    handleError,
    handleRetry
  };
};
