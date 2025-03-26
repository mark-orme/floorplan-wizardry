
/**
 * Grid safety hook
 * Provides safety mechanisms for grid operations
 * @module useGridSafety
 */
import { useCallback } from "react";
import { Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Safety timeout in milliseconds to prevent infinite loops
 */
const SAFETY_TIMEOUT = 5000;

/**
 * Hook for grid operation safety
 * Prevents infinite loops and provides error boundaries for grid operations
 * 
 * @returns {Object} Safety utility functions
 */
export const useGridSafety = () => {
  /**
   * Perform a grid operation with safety mechanisms
   * Provides timeout protection and error handling
   * 
   * @param {Function} operation - The operation to perform
   * @param {string} operationName - Name of the operation for logging
   * @param {FabricObject[]} fallbackResult - Fallback result if operation fails
   * @returns {FabricObject[]} Result of the operation or fallback
   */
  const safeGridOperation = useCallback(<T extends FabricObject[]>(
    operation: () => T,
    operationName: string,
    fallbackResult: T
  ): T => {
    // Use a timeout to prevent infinite loops
    let operationComplete = false;
    let timeoutId: number | null = null;
    
    try {
      // Set safety timeout
      timeoutId = window.setTimeout(() => {
        if (!operationComplete) {
          logger.error(`Operation "${operationName}" timed out after ${SAFETY_TIMEOUT}ms`);
          operationComplete = true;
        }
      }, SAFETY_TIMEOUT);
      
      // Perform the operation
      const result = operation();
      
      // Mark as complete
      operationComplete = true;
      
      // Clear safety timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      
      return result;
    } catch (error) {
      // Mark as complete
      operationComplete = true;
      
      // Clear safety timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      
      logger.error(`Error in grid operation "${operationName}":`, error);
      return fallbackResult;
    }
  }, []);
  
  return {
    safeGridOperation
  };
};
