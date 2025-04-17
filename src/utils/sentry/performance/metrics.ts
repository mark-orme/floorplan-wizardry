
/**
 * Performance metrics utilities for Sentry
 * @module utils/sentry/performance/metrics
 */
import * as Sentry from '@sentry/react';
import { isSentryInitialized } from '../core';
import logger from '../../logger';

/**
 * Measures performance of a function and reports to Sentry
 * 
 * @param name - Name of the operation being measured
 * @param fn - Function to measure
 * @param options - Optional transaction options
 * @returns Result of the function execution
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  options: Record<string, unknown> = {}
): T {
  // Skip if Sentry is not initialized
  if (!isSentryInitialized()) {
    return fn();
  }
  
  // Start transaction
  const transaction = Sentry.startTransaction({
    name: `metric.${name}`,
    op: 'performance.measure',
    ...options
  });
  
  const startTime = performance.now();
  
  try {
    // Execute the function
    const result = fn();
    
    // Calculate duration
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Add performance data to the transaction
    transaction.setData({
      durationMs: duration,
      status: 'ok'
    });
    
    // Set transaction status
    transaction.status = 'ok';
    
    // Log successful performance measurement
    logger.debug(`Performance measurement ${name}:`, {
      durationMs: duration.toFixed(2)
    });
    
    return result;
  } catch (error) {
    // Calculate duration even for errors
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Add error data to the transaction
    transaction.setData({
      durationMs: duration,
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Set transaction status to error
    transaction.status = 'error';
    
    // Log error
    logger.error(`Error during performance measurement ${name}:`, error);
    
    // Re-throw the error to maintain normal error flow
    throw error;
  } finally {
    // Always finish the transaction
    transaction.finish();
  }
}
