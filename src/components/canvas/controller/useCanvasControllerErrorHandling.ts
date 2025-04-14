
/**
 * Hook for error handling in the canvas controller
 * @module useCanvasControllerErrorHandling
 */
import { useCallback } from "react";
import { DebugInfoState } from "@/types/core/DebugInfo";
import { captureError, captureMessage } from "@/utils/sentryUtils";
import { useLocation } from "react-router-dom";

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
  
  const location = useLocation();
  const currentRoute = location.pathname;

  // Handle error with enhanced reporting
  const handleError = useCallback((error: Error) => {
    console.error("Canvas error:", error);
    setHasError(true);
    setErrorMessage(error.message); // This is correctly using Error.message, not passing Error to string
    
    // Create a proper update object that conforms to Partial<DebugInfoState>
    updateDebugInfo({
      performanceStats: {
        // This is optional in DebugInfoState, so we can safely increment it
        errorCount: 1 // Default to 1 if not previously set
      },
      hasError: true,
      errorMessage: error.message,
      lastError: error,
      lastErrorTime: Date.now()
    });
    
    // Report to monitoring system with additional context
    captureError(error, 'canvas-controller-error', {
      level: 'error',
      tags: {
        component: 'CanvasController',
        route: currentRoute
      },
      context: {
        component: 'CanvasController',
        operation: 'rendering',
        route: currentRoute
      },
      extra: {
        message: error.message,
        stack: error.stack
      }
    });
  }, [setHasError, setErrorMessage, updateDebugInfo, currentRoute]);

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
      lastInitTime: Date.now(),
      hasError: false,
      errorMessage: ""
    });
    
    // Report retry attempt
    captureMessage(
      "Canvas controller retry attempt",
      "canvas-retry-attempt",
      {
        level: 'info',
        tags: {
          component: 'CanvasController',
          operation: 'retry',
          route: currentRoute
        }
      }
    );
  }, [setHasError, setErrorMessage, updateDebugInfo, currentRoute]);

  return {
    handleError,
    handleRetry
  };
};
