
/**
 * Hook for grid throttling operations
 * Provides utilities to throttle grid creation and updates
 * @module useGridThrottling
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Hook for grid throttling operations
 * Prevents excessive grid creation operations during rapid interactions
 * 
 * @returns Object containing throttling utility functions
 */
export const useGridThrottling = () => {
  // Reference to store timeout ID
  const throttleTimeoutRef = useRef<number | null>(null);
  
  /**
   * Clear any existing throttle timeout
   */
  const clearThrottleTimeout = useCallback(() => {
    if (throttleTimeoutRef.current !== null) {
      window.clearTimeout(throttleTimeoutRef.current);
      throttleTimeoutRef.current = null;
    }
  }, []);
  
  /**
   * Throttle grid creation function
   * Ensures grid creation is not called too frequently
   * 
   * @param {FabricCanvas} canvas - The Fabric canvas instance
   * @param {Function} createGridCallback - Function to create the grid
   * @param {number} delay - Throttle delay in milliseconds
   * @returns {void}
   */
  const throttleGridCreation = useCallback((
    canvas: FabricCanvas,
    createGridCallback: (canvas: FabricCanvas) => void,
    delay: number = 200
  ): void => {
    // Clear any existing timeout
    clearThrottleTimeout();
    
    // Schedule new timeout
    throttleTimeoutRef.current = window.setTimeout(() => {
      try {
        createGridCallback(canvas);
        logger.debug("Throttled grid creation executed");
      } catch (error) {
        logger.error("Error in throttled grid creation:", error);
      }
      throttleTimeoutRef.current = null;
    }, delay);
  }, [clearThrottleTimeout]);

  /**
   * Determine if grid creation should be throttled
   * Checks current state to decide if throttling is needed
   * 
   * @returns {boolean} True if throttling is needed
   */
  const shouldThrottleCreation = useCallback((): boolean => {
    return throttleTimeoutRef.current !== null;
  }, []);

  /**
   * Handle throttled grid creation
   * Executes grid creation with throttling applied
   * 
   * @param {FabricCanvas} canvas - The Fabric canvas instance
   * @param {Function} createGridCallback - Function to create the grid
   * @returns {void}
   */
  const handleThrottledCreation = useCallback((
    canvas: FabricCanvas,
    createGridCallback: (canvas: FabricCanvas) => void
  ): void => {
    throttleGridCreation(canvas, createGridCallback);
  }, [throttleGridCreation]);

  /**
   * Clean up any pending throttled operations
   * Used when component is unmounting
   */
  const cleanup = useCallback(() => {
    clearThrottleTimeout();
  }, [clearThrottleTimeout]);

  return {
    throttleGridCreation,
    clearThrottleTimeout,
    throttleTimeoutRef,
    shouldThrottleCreation,
    handleThrottledCreation,
    cleanup
  };
};
