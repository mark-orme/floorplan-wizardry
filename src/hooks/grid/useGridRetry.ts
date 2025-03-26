
/**
 * Hook for grid retry operations
 * Provides utilities to handle retrying grid creation after failures
 * @module useGridRetry
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { scheduleGridRetry } from "@/utils/grid/gridErrorHandling";
import logger from "@/utils/logger";

/**
 * Interface for retry configuration
 * @interface RetryConfig
 */
interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Base delay between retry attempts in milliseconds */
  baseDelay: number;
  /** Whether to use exponential backoff for retry delays */
  useExponentialBackoff: boolean;
}

/**
 * Default retry configuration
 * @constant
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  useExponentialBackoff: true
};

/**
 * Hook for grid retry operations
 * Provides functionality to retry grid creation with exponential backoff
 * 
 * @returns Object containing retry utility functions
 */
export const useGridRetry = () => {
  /**
   * Calculate delay for the next retry attempt
   * Uses exponential backoff if configured
   * 
   * @param {number} attempt - Current retry attempt number
   * @param {RetryConfig} config - Retry configuration
   * @returns {number} Delay in milliseconds
   */
  const calculateRetryDelay = useCallback((attempt: number, config: RetryConfig = DEFAULT_RETRY_CONFIG): number => {
    if (config.useExponentialBackoff) {
      // Exponential backoff: baseDelay * 2^attempt
      return config.baseDelay * Math.pow(2, attempt);
    }
    // Linear backoff: baseDelay * attempt
    return config.baseDelay * attempt;
  }, []);
  
  /**
   * Retry grid creation with exponential backoff
   * 
   * @param {FabricCanvas} canvas - The Fabric canvas instance
   * @param {Function} createGridCallback - Function to create the grid
   * @param {number} attempt - Current retry attempt number
   * @param {RetryConfig} config - Retry configuration
   * @returns {number|null} Timeout ID or null if max retries reached
   */
  const retryWithBackoff = useCallback((
    canvas: FabricCanvas,
    createGridCallback: (canvas: FabricCanvas) => void,
    attempt: number = 0,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
  ): number | null => {
    if (attempt >= config.maxRetries) {
      logger.warn(`Max retries (${config.maxRetries}) reached for grid creation`);
      return null;
    }
    
    const delay = calculateRetryDelay(attempt, config);
    logger.info(`Scheduling grid creation retry ${attempt + 1}/${config.maxRetries} in ${delay}ms`);
    
    return scheduleGridRetry(canvas, createGridCallback, delay);
  }, [calculateRetryDelay]);

  /**
   * Create grid with retry mechanism
   * Attempts to create grid and retries on failure
   * 
   * @param {FabricCanvas} canvas - The Fabric canvas instance
   * @param {Function} createGridCallback - Function to create the grid
   * @returns {boolean} True if grid creation was successful or scheduled for retry
   */
  const createGridWithRetry = useCallback((
    canvas: FabricCanvas,
    createGridCallback: (canvas: FabricCanvas) => void
  ): boolean => {
    try {
      createGridCallback(canvas);
      return true;
    } catch (error) {
      logger.error("Grid creation failed, scheduling retry:", error);
      retryWithBackoff(canvas, createGridCallback);
      return false;
    }
  }, [retryWithBackoff]);

  /**
   * Clean up any pending retry operations
   * Used when component is unmounting
   */
  const cleanup = useCallback(() => {
    // In a real implementation, this would cancel any pending retries
    logger.info("Cleaning up grid retry operations");
  }, []);

  return {
    retryWithBackoff,
    calculateRetryDelay,
    DEFAULT_RETRY_CONFIG,
    createGridWithRetry,
    cleanup
  };
};
