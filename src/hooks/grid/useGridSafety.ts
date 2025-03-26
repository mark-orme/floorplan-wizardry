
/**
 * Hook for grid safety operations
 * Provides safety mechanisms for grid creation and mutation
 * @module useGridSafety
 */
import { useCallback } from "react";
import logger from "@/utils/logger";

/**
 * Result of the useGridSafety hook
 * @interface UseGridSafetyResult
 */
interface UseGridSafetyResult {
  /** Function to safely execute grid operations with error handling */
  safeGridOperation: <T>(operation: () => T, operationName: string, fallbackResult: T) => T;
}

/**
 * Hook for grid safety operations
 * Provides utilities to execute grid operations safely with error handling
 * and fallback mechanisms
 * 
 * @returns {UseGridSafetyResult} Grid safety utilities
 * 
 * @example
 * const { safeGridOperation } = useGridSafety();
 * 
 * // Use safe operation to prevent crashes
 * const result = safeGridOperation(
 *   () => dangerousGridOperation(),
 *   'create-grid',
 *   fallbackGridObjects
 * );
 */
export const useGridSafety = (): UseGridSafetyResult => {
  /**
   * Execute a grid operation safely
   * Ensures grid operations don't crash the application
   * Provides proper error handling and fallback mechanism
   * 
   * @template T - The return type of the operation
   * @param {Function} operation - The grid operation to perform
   * @param {string} operationName - Name of the operation (for logging)
   * @param {T} fallbackResult - Fallback result if operation fails
   * @returns {T} Result of the operation or fallback
   */
  const safeGridOperation = useCallback(<T>(
    operation: () => T,
    operationName: string,
    fallbackResult: T
  ): T => {
    try {
      return operation();
    } catch (error) {
      logger.error(`Error in grid operation "${operationName}":`, error);
      return fallbackResult;
    }
  }, []);
  
  return {
    safeGridOperation
  };
};
