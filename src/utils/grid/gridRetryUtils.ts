
/**
 * Grid retry utilities
 * @module utils/grid/gridRetryUtils
 */
import logger from "@/utils/logger";

/**
 * Retry an operation with exponential backoff
 * 
 * @param {() => Promise<T>} operation - Operation to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<T>} Result of operation
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  initialDelay = 100
): Promise<T> => {
  let attempts = 0;
  let delay = initialDelay;
  
  while (attempts < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      
      // Throw if max attempts reached
      if (attempts >= maxAttempts) {
        throw error;
      }
      
      // Wait with exponential backoff
      delay *= 2;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Max retry attempts reached");
};

/**
 * Execute an operation with timeout
 * 
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<T>} Result of operation
 */
export const executeWithTimeout = async <T>(
  operation: () => Promise<T>,
  timeout = 5000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    // Set up timeout
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeout}ms`));
    }, timeout);
    
    // Execute operation
    operation()
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};
