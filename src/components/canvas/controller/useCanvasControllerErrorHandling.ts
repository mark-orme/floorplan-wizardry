
/**
 * Hook for error handling in the canvas controller
 * @module useCanvasControllerErrorHandling
 */
import { useCallback } from "react";
import { DebugInfoState } from "@/types/debugTypes";

interface UseCanvasControllerErrorHandlingProps {
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  updateDebugInfo: (info: Partial<DebugInfoState>) => void;
}

// Extend DebugInfoState to include our needed properties
declare module '@/types/debugTypes' {
  interface DebugInfoState {
    errorCount?: number;
    lastRetryTime?: string;
    retryCount?: number;
  }
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
    updateDebugInfo({ 
      errorCount: prev => (prev || 0) + 1 
    });
  }, [setHasError, setErrorMessage, updateDebugInfo]);

  // Handle retry attempt
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
    updateDebugInfo({ 
      lastRetryTime: new Date().toISOString(),
      retryCount: prev => (prev || 0) + 1
    });
  }, [setHasError, setErrorMessage, updateDebugInfo]);

  return {
    handleError,
    handleRetry
  };
};
