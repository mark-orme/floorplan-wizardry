
/**
 * Hook for grid safety operations
 * Provides safety mechanisms for grid creation and mutation
 * @module useGridSafety
 */
import { useCallback } from "react";
import logger from "@/utils/logger";

/**
 * Hook for grid safety operations
 * @returns Grid safety utilities
 */
export const useGridSafety = () => {
  /**
   * Execute a grid operation safely
   * Ensures grid operations don't crash the application
   * 
   * @param {Function} operation - The grid operation to perform
   * @param {string} operationName - Name of the operation (for logging)
   * @param {any[]} fallbackResult - Fallback result if operation fails
   * @returns Result of the operation or fallback
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
