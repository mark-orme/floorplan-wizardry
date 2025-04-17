
/**
 * Performance measurement utilities
 * @module utils/sentry/performance/metrics
 */
import { startPerformanceTransaction } from './core';
import logger from '../../logger';

/**
 * Measure a performance operation
 * 
 * @param name - Operation name
 * @param callback - Operation to measure
 * @returns Operation result
 */
export function measurePerformance<T>(
  name: string,
  callback: () => T
): T {
  const transaction = startPerformanceTransaction(name);
  
  try {
    // Execute the callback
    const result = callback();
    
    // Finish the transaction with success
    transaction.finish('ok');
    
    return result;
  } catch (error) {
    // Finish the transaction with error
    transaction.finish('error', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    // Re-throw the error
    throw error;
  }
}
