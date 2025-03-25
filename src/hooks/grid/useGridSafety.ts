
/**
 * Hook for grid safety operations
 * Manages safe grid operations and error prevention
 * @module useGridSafety
 */
import { useCallback } from "react";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";

/**
 * Hook for grid safety operations
 * @returns {Object} Grid safety utilities
 */
export const useGridSafety = () => {
  /**
   * Handle grid operation failure
   * Properly logs and tracks errors during grid operations
   * @param {Error} error - The error that occurred
   * @param {string} context - Context for the error
   */
  const handleGridFailure = useCallback((error: Error, context: string) => {
    logger.error(`Grid operation failed in ${context}:`, error);
    
    // Report to Sentry
    captureError(error, `grid-${context}`, {
      tags: {
        component: 'grid',
        operation: context
      }
    });
  }, []);
  
  /**
   * Safely execute a grid operation with error handling
   * @param {Function} operation - The operation to execute
   * @param {string} context - Context for error reporting
   * @param {any} fallbackValue - Value to return on error
   * @returns {any} The operation result or fallback value
   */
  const safeGridOperation = useCallback(<T>(
    operation: () => T,
    context: string,
    fallbackValue: T
  ): T => {
    try {
      return operation();
    } catch (error) {
      handleGridFailure(error instanceof Error ? error : new Error(String(error)), context);
      return fallbackValue;
    }
  }, [handleGridFailure]);
  
  return {
    handleGridFailure,
    safeGridOperation
  };
};
