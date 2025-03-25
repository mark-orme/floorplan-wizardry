
/**
 * Custom hook for canvas error handling and retries
 * @module useCanvasErrorHandling
 */
import { useCallback } from "react";
import { toast } from "sonner";

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
 * Hook for managing canvas error states and retry functionality
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
   */
  const handleRetry = useCallback(() => {
    resetLoadTimes();
    loadData();
  }, [loadData, resetLoadTimes]);

  /**
   * Handle specific errors
   * @param {unknown} error - The error that occurred
   * @param {string} context - Context description for the error
   */
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Error ${context}:`, error);
    setHasError(true);
    setErrorMessage(`Failed to ${context}: ${error instanceof Error ? error.message : String(error)}`);
    toast.error(`Failed to ${context}`);
  }, [setHasError, setErrorMessage]);

  return {
    handleRetry,
    handleError
  };
};
