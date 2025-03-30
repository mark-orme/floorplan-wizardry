
/**
 * Custom hook for canvas error handling and retries
 * Provides centralized error handling and recovery mechanisms
 * @module useCanvasErrorHandling
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { captureError } from "@/utils/sentryUtils";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";

/**
 * Props for the useCanvasErrorHandling hook
 * @interface UseCanvasErrorHandlingProps
 */
interface UseCanvasErrorHandlingProps {
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
  /** Function to reset canvas load times */
  resetLoadTimes: () => void;
  /** Function to load data */
  loadData: () => Promise<unknown>;
}

/**
 * Return type for the useCanvasErrorHandling hook
 * @interface UseCanvasErrorHandlingResult
 */
interface UseCanvasErrorHandlingResult {
  /** Handle retry after an error occurs */
  handleRetry: () => void;
  /** Handle specific errors */
  handleError: (error: unknown, context: string) => void;
}

/**
 * Convert unknown error to proper Error object
 * @param {unknown} error - The error to convert
 * @returns {Error} Converted error
 */
const convertToError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error(typeof error === 'string' ? error : 'Unknown error occurred');
};

/**
 * Hook for managing canvas error states and retry functionality
 * Provides consistent error handling and retry mechanisms
 * 
 * @param {UseCanvasErrorHandlingProps} props - Hook properties
 * @returns {UseCanvasErrorHandlingResult} Error handling utilities
 */
export const useCanvasErrorHandling = ({
  setHasError,
  setErrorMessage,
  resetLoadTimes,
  loadData
}: UseCanvasErrorHandlingProps): UseCanvasErrorHandlingResult => {
  /**
   * Handle retry after an error occurs
   * Resets state and attempts to reload data
   */
  const handleRetry = useCallback(() => {
    try {
      // Reset canvas initialization state
      resetInitializationState();
      
      // Reset error state
      setHasError(false);
      setErrorMessage("");
      
      // Reset load times
      resetLoadTimes();
      
      // Attempt to reload data
      loadData().catch(error => {
        handleError(error, "retry-load-data");
      });
      
      toast.success("Retrying...", { id: "canvas-retry" });
    } catch (error) {
      handleError(error, "retry-operation");
    }
  }, [loadData, resetLoadTimes, setHasError, setErrorMessage]);

  /**
   * Handle specific errors
   * Processes errors, updates state, and notifies the user
   * 
   * @param {unknown} error - The error that occurred
   * @param {string} context - Context description for the error
   */
  const handleError = useCallback((error: unknown, context: string) => {
    const errorObj = convertToError(error);
    console.error(`Error ${context}:`, errorObj);
    setHasError(true);
    setErrorMessage(`Failed to ${context}: ${errorObj.message}`);
    toast.error(`Failed to ${context}`);
    
    // Report error to Sentry with properly converted error
    captureError(errorObj, `canvas-${context}`, {
      tags: {
        component: 'canvas',
        operation: context
      }
    });
  }, [setHasError, setErrorMessage]);

  return {
    handleRetry,
    handleError
  };
};
