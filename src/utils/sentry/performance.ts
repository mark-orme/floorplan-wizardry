
/**
 * Sentry performance tracking
 * @module utils/sentry/performance
 */
import * as Sentry from '@sentry/react';
import logger from '../logger';
import { isSentryInitialized } from './core';
import { TransactionOptions, TransactionResult } from './types';

/**
 * Start a performance transaction for tracking
 * 
 * @param {string} name - Transaction name
 * @param {TransactionOptions} options - Transaction options
 * @returns {TransactionResult} Transaction object with finish method
 */
export function startPerformanceTransaction(
  name: string,
  options: TransactionOptions = {}
): TransactionResult {
  // Get environment
  const isProd = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  
  // Log transaction start
  logger.debug(`Starting transaction: ${name}`, options);
  
  // Create transaction reference
  let transaction: Sentry.Transaction | null = null;
  
  // Start transaction in Sentry if available
  if (isSentryInitialized() && !isTest) {
    try {
      transaction = Sentry.startTransaction({
        name,
        data: options.data
      });
      
      // Set any tags
      if (options.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          transaction?.setTag(key, value);
        });
      }
      
      // Set current transaction for spans to be attached to it
      Sentry.configureScope(scope => {
        scope.setSpan(transaction);
      });
    } catch (error) {
      console.error('Failed to start Sentry transaction:', error);
    }
  }
  
  // Start time for manual tracking
  const startTime = performance.now();
  
  /**
   * Finish the transaction and record performance metrics
   * @param {string | number} status - Transaction status or error severity
   */
  const finish = (status?: string | number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log transaction end
    logger.debug(`Finished transaction: ${name}`, {
      duration: `${duration.toFixed(2)}ms`,
      status
    });
    
    // Finish Sentry transaction if available
    if (transaction) {
      try {
        // Set final status
        if (status !== undefined) {
          if (typeof status === 'string') {
            transaction.setStatus(status);
          } else {
            // Convert number to status string (e.g., 200 -> 'ok', 500 -> 'error')
            transaction.setStatus(status < 400 ? 'ok' : 'error');
          }
        }
        
        // Add duration data
        transaction.setData('duration_ms', duration);
        
        // Finish the transaction
        transaction.finish();
      } catch (error) {
        console.error('Failed to finish Sentry transaction:', error);
      }
    }
  };
  
  // Return transaction with control methods
  return {
    finish,
    setName: (newName: string) => {
      if (transaction) {
        transaction.name = newName;
      }
    },
    setStatus: (newStatus: string) => {
      if (transaction) {
        transaction.status = newStatus;
      }
    },
    setTag: (key: string, value: string) => {
      if (transaction) {
        transaction.setTag(key, value);
      }
    },
    setData: (key: string, value: any) => {
      if (transaction) {
        transaction.setData(key, value);
      }
    }
  };
}

/**
 * Measure the performance of a function
 * 
 * @param {string} name - Operation name
 * @param {Function} fn - Function to measure
 * @param {TransactionOptions} options - Transaction options
 * @returns {T} Result of the function
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  options: TransactionOptions = {}
): T {
  const transaction = startPerformanceTransaction(name, options);
  
  try {
    const result = fn();
    transaction.finish('ok');
    return result;
  } catch (error) {
    transaction.finish('error');
    throw error;
  }
}

/**
 * Measure the performance of an async function
 * 
 * @param {string} name - Operation name
 * @param {Function} fn - Async function to measure
 * @param {TransactionOptions} options - Transaction options
 * @returns {Promise<T>} Result of the async function
 */
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const transaction = startPerformanceTransaction(name, options);
  
  try {
    const result = await fn();
    transaction.finish('ok');
    return result;
  } catch (error) {
    transaction.finish('error');
    throw error;
  }
}
