
/**
 * Hook for error handling in the canvas controller
 * Provides standardized error management and reporting
 * @module components/canvas/controller/useCanvasControllerErrorHandling
 */
import { useCallback, useEffect } from "react";
import { DebugInfoState } from "@/types/core/DebugInfo";
import { captureError, captureMessage } from "@/utils/sentryUtils";
import * as Sentry from '@sentry/react';
import { useLocation } from "react-router-dom";

/**
 * Props for the useCanvasControllerErrorHandling hook
 * 
 * @interface UseCanvasControllerErrorHandlingProps
 * @property {(value: boolean) => void} setHasError - Function to set error state
 * @property {(value: string) => void} setErrorMessage - Function to set error message
 * @property {(info: Partial<DebugInfoState>) => void} updateDebugInfo - Function to update debug info
 */
interface UseCanvasControllerErrorHandlingProps {
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  updateDebugInfo: (info: Partial<DebugInfoState>) => void;
}

/**
 * Result of the useCanvasControllerErrorHandling hook
 * 
 * @interface UseCanvasControllerErrorHandlingResult
 * @property {(error: Error) => void} handleError - Function to handle errors
 * @property {() => void} handleRetry - Function to handle retry attempts
 */
export const useCanvasControllerErrorHandling = (props: UseCanvasControllerErrorHandlingProps) => {
  const {
    setHasError,
    setErrorMessage,
    updateDebugInfo
  } = props;
  
  const location = useLocation();
  const currentRoute = location.pathname;
  
  // Set component context in Sentry on mount
  useEffect(() => {
    Sentry.setTag("component", "CanvasController");
    Sentry.setTag("route", currentRoute);
    Sentry.setContext("controllerState", {
      route: currentRoute,
      componentType: "errorHandler"
    });
    
    return () => {
      // Clear component-specific tags on unmount
      Sentry.setTag("component", null);
    };
  }, [currentRoute]);

  /**
   * Handle error with enhanced reporting
   * Updates error state, logs error details, and reports to monitoring
   * 
   * @param {Error} error - The error that occurred
   */
  const handleError = useCallback((error: Error) => {
    console.error("Canvas error:", error);
    setHasError(true);
    setErrorMessage(error.message || "Unknown error occurred"); // Using Error.message which is a string
    
    // Set error context in Sentry
    Sentry.setTag("errorState", "active");
    Sentry.setTag("errorSource", "canvasController");
    Sentry.setContext("errorDetails", {
      message: error.message,
      stack: error.stack,
      time: new Date().toISOString(),
      route: currentRoute
    });
    
    // Update debug info with error details
    updateDebugInfo({
      hasError: true,
      errorMessage: error.message || "Unknown error occurred",
      lastErrorTime: Date.now(),
      lastError: error.message
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

  /**
   * Handle retry attempt after error
   * Clears error state and reports recovery attempt
   */
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
    
    // Clear error state in Sentry
    Sentry.setTag("errorState", "resolved");
    Sentry.setContext("recovery", {
      attemptTime: new Date().toISOString(),
      route: currentRoute
    });
    
    // Update debug info with retry details
    updateDebugInfo({
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
