
/**
 * Sentry performance monitoring utilities
 * @module utils/sentry/performance
 */
import * as Sentry from '@sentry/react';
import { Canvas as FabricCanvas } from 'fabric';
import { isSentryInitialized } from './core';
import logger from '../logger';

/**
 * Transaction object type
 */
export interface PerformanceTransaction {
  name: string;
  startTime: number;
  transaction: any;
  finish: (status: string, data?: Record<string, unknown>) => void;
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
      finish: (status: string, data?: Record<string, unknown>) => {} // No-op finish function
    };
  }
  
  try {
    // Start a new transaction
    const transaction = Sentry.startTransaction({
      name,
      op: 'performance',
      ...(options || {})
    });
    
    // Store start time for duration calculation
    const startTime = performance.now();
    
    // Return transaction details with finish method
    return {
      name,
      startTime,
      transaction,
      finish: (status: string = 'ok', data: Record<string, unknown> = {}) => {
        if (transaction) {
          // Calculate the actual duration
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Add data to transaction
          transaction.setData({
            status,
            durationMs: duration,
            ...data
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
      finish: (status: string, data?: Record<string, unknown>) => {} // No-op finish function
    };
  }
}

/**
 * Finish a performance transaction
 * 
 * @param transaction - Transaction object to finish
 * @param status - Transaction status
 * @param data - Additional data to include
 */
export function finishPerformanceTransaction(
  transaction: PerformanceTransaction,
  status: 'ok' | 'error' | 'cancelled' = 'ok',
  data: Record<string, unknown> = {}
): void {
  if (!transaction || !transaction.transaction) return;
  
  try {
    // Calculate duration
    const duration = performance.now() - transaction.startTime;
    
    // Add data to transaction
    transaction.transaction.setData({
      status,
      durationMs: duration,
      ...data
    });
    
    // Set status and finish
    transaction.transaction.status = status;
    transaction.transaction.finish();
    
    // Log performance info
    logger.debug(`Performance transaction ${transaction.name} completed:`, {
      status,
      durationMs: duration
    });
  } catch (error) {
    // Log error but don't break app flow
    logger.error(`Error finishing transaction ${transaction.name}:`, error);
  }
}

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

/**
 * Start a canvas performance transaction
 * 
 * @param name - Transaction name
 * @param canvas - Canvas object (required)
 * @param options - Optional transaction options (tags, data)
 * @returns Transaction object
 */
export function startCanvasTransaction(
  name: string, 
  canvas: FabricCanvas | null,
  options: Record<string, unknown> = {}
): {
  name: string;
  startTime: number;
  transaction: any;
  finish: (status?: string, data?: Record<string, unknown>) => void;
} {
  // If Sentry isn't initialized, return a no-op transaction object
  if (!isSentryInitialized()) {
    return {
      name,
      startTime: performance.now(),
      transaction: null,
      finish: () => {} // No-op finish function
    };
  }
  
  try {
    const transaction = Sentry.startTransaction({
      name: `canvas.${name}`,
      op: 'performance',
      ...options
    });
    
    const startTime = performance.now();
    
    return {
      name,
      startTime,
      transaction,
      finish: (status: string = 'ok', data: Record<string, unknown> = {}) => {
        if (transaction) {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          transaction.setData({
            status,
            durationMs: duration,
            canvasObjects: canvas ? canvas.getObjects().length : 0,
            ...data
          });
          
          transaction.status = status;
          transaction.finish();
        }
      }
    };
  } catch (error) {
    logger.error(`Error starting transaction ${name}:`, error);
    
    return {
      name,
      startTime: performance.now(),
      transaction: null,
      finish: () => {} // No-op finish function
    };
  }
}
