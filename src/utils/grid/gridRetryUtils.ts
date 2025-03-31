
/**
 * Grid retry utilities
 * Provides retry mechanisms for grid operations
 * @module utils/grid/gridRetryUtils
 */

import logger from "@/utils/logger";

/**
 * Retry an operation with exponential backoff
 * Useful for operations that might temporarily fail
 * 
 * @param {() => Promise<T>} operation - The async operation to retry
 * @param {number} [maxRetries=3] - Maximum number of retry attempts
 * @param {number} [initialDelay=100] - Initial delay in milliseconds
 * @returns {Promise<T>} Result of the operation
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 100
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries - 1) {
        // Last attempt failed, don't need to wait
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      
      logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} for operation, waiting ${delay}ms`, {
        error: lastError.message
      });
      
      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // All retries failed
  throw lastError || new Error("Operation failed after retries");
};

/**
 * Execute an operation with a timeout
 * Prevents operations from hanging indefinitely
 * 
 * @param {() => Promise<T>} operation - The async operation to execute
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @returns {Promise<T>} Result of the operation
 */
export const executeWithTimeout = async <T>(
  operation: () => Promise<T>,
  timeoutMs: number = 5000
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    // Track whether the operation has completed
    let hasCompleted = false;
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!hasCompleted) {
        hasCompleted = true;
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);
    
    // Execute the operation
    operation()
      .then(result => {
        if (!hasCompleted) {
          hasCompleted = true;
          clearTimeout(timeoutId);
          resolve(result);
        }
      })
      .catch(error => {
        if (!hasCompleted) {
          hasCompleted = true;
          clearTimeout(timeoutId);
          reject(error);
        }
      });
  });
};
