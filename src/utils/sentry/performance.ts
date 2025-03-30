
/**
 * Sentry performance monitoring functionality
 * @module utils/sentry/performance
 */
import * as Sentry from '@sentry/react';
import logger from '../logger';
import { isSentryInitialized } from './core';

/**
 * Start performance monitoring for a specific operation
 * 
 * @param {string} name - Name of the operation
 * @param {Record<string, string>} [tags] - Additional tags for the transaction
 * @returns {Object} Transaction object with finish method
 */
export function startPerformanceTransaction(name: string, tags?: Record<string, string>) {
  // Create a timestamp for fallback timing
  const startTime = performance.now();
  let transaction: Sentry.Transaction | null = null;
  
  try {
    if (isSentryInitialized()) {
      transaction = Sentry.startTransaction({ name });
      
      // Add tags if provided
      if (tags && transaction) {
        Object.entries(tags).forEach(([key, value]) => {
          transaction?.setTag(key, value);
        });
      }
    }
  } catch (e) {
    console.error('Failed to start Sentry transaction:', e);
  }
  
  return {
    finish: (status?: string) => {
      try {
        if (transaction) {
          // Finish the Sentry transaction
          transaction.finish(status);
        } else {
          // Log fallback timing
          const duration = performance.now() - startTime;
          logger.debug(`Operation "${name}" took ${duration.toFixed(2)}ms`, { tags });
        }
      } catch (e) {
        console.error('Failed to finish Sentry transaction:', e);
      }
    }
  };
}
