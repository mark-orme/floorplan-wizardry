
/**
 * Grid retry utilities
 * Provides tools for retrying grid operations with exponential backoff
 * @module utils/gridRetryUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "./gridCreationUtils";
import logger from "./logger";

/**
 * Grid creation retry options
 */
interface GridRetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Initial delay between retries (ms) */
  initialDelay?: number;
  /** Whether to use exponential backoff */
  useExponentialBackoff?: boolean;
  /** Callback function for retry attempts */
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry a grid creation function with exponential backoff
 * @param {Function} creationFn - Function to create grid
 * @param {GridRetryOptions} options - Retry options
 * @returns {Promise<FabricObject[]>} Created grid objects
 */
export const retryGridCreation = async (
  creationFn: () => FabricObject[] | Promise<FabricObject[]>,
  options: GridRetryOptions = {}
): Promise<FabricObject[]> => {
  const {
    maxAttempts = 3,
    initialDelay = 100,
    useExponentialBackoff = true,
    onRetry
  } = options;
  
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt < maxAttempts) {
    try {
      const result = await creationFn();
      if (result && result.length > 0) {
        logger.info(`Grid created successfully on attempt ${attempt + 1}`);
        return result;
      }
      
      // Empty result is considered a failure
      throw new Error('Grid creation returned empty result');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.error(`Grid creation failed on attempt ${attempt + 1}:`, error);
      
      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }
      
      // Calculate delay for next attempt
      const delay = useExponentialBackoff
        ? initialDelay * Math.pow(2, attempt)
        : initialDelay;
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increment attempt counter
      attempt++;
    }
  }
  
  // All attempts failed
  logger.error(`All ${maxAttempts} grid creation attempts failed`);
  throw lastError || new Error('Grid creation failed after multiple attempts');
};

/**
 * Create grid with automatic retry
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {Function} createFn - Grid creation function
 * @param {GridRetryOptions} options - Retry options
 * @returns {Promise<FabricObject[]>} Created grid objects
 */
export const createGridWithRetry = async (
  canvas: FabricCanvas,
  createFn: (canvas: FabricCanvas) => FabricObject[],
  options: GridRetryOptions = {}
): Promise<FabricObject[]> => {
  try {
    return await retryGridCreation(
      () => createFn(canvas),
      options
    );
  } catch (error) {
    logger.error("Grid creation failed after retries, using emergency grid:", error);
    
    // Use emergency grid as last resort
    return createBasicEmergencyGrid(canvas);
  }
};

/**
 * Report a grid error to monitoring service
 * @param {Error} error - Error to report
 * @param {string} operation - Operation that failed
 * @param {string} level - Error severity level
 */
export const reportGridError = (
  error: Error,
  operation: string,
  level: "error" | "warning" | "info" = "error"
): void => {
  // Log error message
  const message = `Grid operation [${operation}] failed: ${error.message}`;
  
  // Log to console
  if (level === "error") {
    console.error(message, error);
  } else if (level === "warning") {
    console.warn(message, error);
  } else {
    console.info(message, error);
  }
  
  // In a real app, we would report to monitoring service here
};
