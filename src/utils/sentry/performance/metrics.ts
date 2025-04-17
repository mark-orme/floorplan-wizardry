
import * as Sentry from '@sentry/react';
import { isSentryInitialized } from '../core';
import logger from '../../logger';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Measure the performance of a function execution
 * @param name Name of the performance measurement
 * @param fn Function to measure
 * @param canvas Optional canvas for context
 * @param options Additional measurement options
 * @returns Result of the measured function
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  canvas: FabricCanvas | null = null,
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
  
  // Add canvas data if available
  if (canvas) {
    transaction.setData('canvas', {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects().length
    });
  }
  
  try {
    // Execute the function
    const result = fn();
    
    // Calculate duration
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Add performance data to the transaction
    transaction.setData({
      durationMs: duration,
      status: 'ok',
      canvasObjects: canvas ? canvas.getObjects().length : 0
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
