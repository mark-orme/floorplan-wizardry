
/**
 * Core Sentry performance monitoring utilities
 * @module utils/sentry/performance/core
 */
import * as Sentry from '@sentry/react';
import { isSentryInitialized } from '../core';
import logger from '../../logger';

/**
 * Transaction object type
 */
export interface PerformanceTransaction {
  name: string;
  startTime: number;
  transaction: any;
  finish: (status?: string) => void; // Simplified finish signature with one parameter
}

/**
 * Start a performance transaction
 * 
 * @param name - Transaction name
 * @param options - Optional transaction options (tags, data)
 * @returns Transaction object
 */
export function startPerformanceTransaction(
  name: string,
  options: Record<string, unknown> = {}
): PerformanceTransaction {
  // Only start if Sentry is initialized
  if (!isSentryInitialized()) {
    return {
      name,
      startTime: performance.now(),
      transaction: null,
      finish: () => {} // No-op finish function
    };
  }
  
  try {
    // Start a new transaction
    const transaction = Sentry.startTransaction({
      name,
      op: 'performance',
      ...options
    });
    
    // Store start time for duration calculation
    const startTime = performance.now();
    
    // Return transaction details with finish method
    return {
      name,
      startTime,
      transaction,
      finish: (status = 'ok') => { // Simplified to one parameter
        if (transaction) {
          // Calculate the actual duration
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Add data to transaction
          transaction.setData({
            status,
            durationMs: duration
          });
          
          // Set status and finish
          transaction.status = status;
          transaction.finish();
        }
      }
    };
  } catch (error) {
    // Log error but don't break app flow
    logger.error(`Error starting transaction ${name}:`, error);
    
    // Return placeholder with no-op finish
    return {
      name,
      startTime: performance.now(),
      transaction: null,
      finish: () => {} // No-op finish function
    };
  }
}

/**
 * Finish a performance transaction
 * 
 * @param transaction - Transaction object to finish
 * @param status - Transaction status
 */
export function finishPerformanceTransaction(
  transaction: PerformanceTransaction,
  status: 'ok' | 'error' | 'cancelled' = 'ok'
): void {
  if (!transaction || !transaction.transaction) return;
  
  try {
    // Execute the transaction's finish method with the provided status
    transaction.finish(status);
    
    // Log performance info
    logger.debug(`Performance transaction ${transaction.name} completed:`, {
      status,
      durationMs: performance.now() - transaction.startTime
    });
  } catch (error) {
    // Log error but don't break app flow
    logger.error(`Error finishing transaction ${transaction.name}:`, error);
  }
}
