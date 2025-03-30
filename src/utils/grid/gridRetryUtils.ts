
/**
 * Grid retry utilities
 * Functions for handling retry logic and async operations
 * @module utils/grid/gridRetryUtils
 */

/**
 * Retry an operation with exponential backoff
 * @param operation Operation to retry
 * @param maxRetries Maximum number of retries
 * @returns Promise that resolves to operation result
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let retries = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, retries) * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      retries++;
    }
  }
};

/**
 * Execute a grid operation with timeout protection
 * @param operation Operation to execute
 * @param timeout Timeout in milliseconds
 * @returns Promise that resolves to operation result
 */
export const executeWithTimeout = async <T>(
  operation: () => Promise<T>,
  timeout: number = 5000
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    let isResolved = false;
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }
    }, timeout);
    
    // Execute operation
    operation()
      .then(result => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          resolve(result);
        }
      })
      .catch(error => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          reject(error);
        }
      });
  });
};
