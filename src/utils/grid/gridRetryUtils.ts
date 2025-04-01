
/**
 * Grid retry utilities
 * Functions to handle retries for grid creation
 * @module utils/grid/gridRetryUtils
 */
import logger from '@/utils/logger';

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay between retries in ms
 * @returns Promise that resolves with the function result or rejects after max retries
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 300
): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        logger.error(`Max retries (${maxRetries}) reached, giving up:`, error);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, retries - 1);
      logger.warn(`Retry ${retries}/${maxRetries} after ${delay}ms:`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Execute a function with a timeout
 * @param fn - Function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise that resolves with the function result or rejects on timeout
 */
export async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 5000
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    fn()
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}
