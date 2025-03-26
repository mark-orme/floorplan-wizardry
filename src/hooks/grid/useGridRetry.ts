
/**
 * Grid retry hook
 * Manages retry logic for grid creation to ensure reliability
 * @module useGridRetry
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Maximum retry attempts
 */
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Props for the useGridRetry hook
 * @interface UseGridRetryProps
 */
interface UseGridRetryProps {
  /** Setter for error state */
  setHasError: (value: boolean) => void;
  
  /** Setter for error message */
  setErrorMessage: (value: string) => void;
}

/**
 * Hook for managing grid creation retries
 * Provides automatic retry functionality for grid creation
 * 
 * @param {UseGridRetryProps} props - Hook properties
 * @returns {Object} Retry utility functions
 */
export const useGridRetry = ({
  setHasError,
  setErrorMessage
}: UseGridRetryProps) => {
  /**
   * Create grid with retry logic
   * Attempts to create grid up to MAX_RETRY_ATTEMPTS times
   * 
   * @param {FabricCanvas} canvas - The fabric canvas instance
   * @param {Function} createBaseGrid - Base grid creation function
   * @returns {FabricObject[] | boolean} Created grid objects or status boolean
   */
  const createGridWithRetry = useCallback((
    canvas: FabricCanvas,
    createBaseGrid: (canvas: FabricCanvas) => FabricObject[]
  ): FabricObject[] | boolean => {
    let attempt = 0;
    let success = false;
    let gridObjects: FabricObject[] = [];
    
    while (attempt < MAX_RETRY_ATTEMPTS && !success) {
      try {
        logger.debug(`Grid creation attempt ${attempt + 1}/${MAX_RETRY_ATTEMPTS}`);
        
        gridObjects = createBaseGrid(canvas);
        
        if (gridObjects && gridObjects.length > 0) {
          success = true;
          logger.debug(`Grid created successfully on attempt ${attempt + 1}`);
        } else {
          attempt++;
          logger.warn(`Grid creation attempt ${attempt} failed - empty result`);
        }
      } catch (error) {
        attempt++;
        logger.error(`Grid creation attempt ${attempt} failed with error:`, error);
        
        // Short delay before retrying
        if (attempt < MAX_RETRY_ATTEMPTS) {
          logger.debug(`Retrying grid creation in ${attempt * 100}ms`);
        }
      }
    }
    
    if (!success) {
      setHasError(true);
      setErrorMessage(`Grid creation failed after ${MAX_RETRY_ATTEMPTS} attempts`);
      logger.error(`Grid creation failed after ${MAX_RETRY_ATTEMPTS} attempts`);
      return false;
    }
    
    return gridObjects;
  }, [setHasError, setErrorMessage]);
  
  /**
   * Clean up retry state
   */
  const cleanup = useCallback((): void => {
    // No state to clean up in this implementation
    logger.debug("Grid retry cleanup called");
  }, []);
  
  return {
    createGridWithRetry,
    cleanup
  };
};
