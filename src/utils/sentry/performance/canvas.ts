
import * as Sentry from '@sentry/react';
import { Canvas as FabricCanvas } from 'fabric';
import { isSentryInitialized } from '../core';
import logger from '../../logger';
import { PerformanceTransaction } from './core';

/**
 * Start a canvas-specific performance transaction
 * @param name Transaction name
 * @param canvas FabricCanvas instance
 * @param options Additional transaction options
 * @returns Transaction object with finish method
 */
export function startCanvasTransaction(
  name: string, 
  canvas: FabricCanvas | null = null,
  options: Record<string, unknown> = {}
): PerformanceTransaction {
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

    // Add canvas data if available
    if (canvas) {
      transaction.setData('canvas', {
        width: canvas ? canvas.width : 0,
        height: canvas ? canvas.height : 0,
        objectCount: canvas ? canvas.getObjects().length : 0
      });
    }

    return {
      name,
      startTime,
      transaction,
      finish: (status = 'ok') => {
        if (transaction) {
          const endTime = performance.now();
          const duration = endTime - startTime;

          transaction.setData({
            status,
            durationMs: duration,
            canvasObjects: canvas ? canvas.getObjects().length : 0
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

/**
 * Start long-running canvas tracking
 * @param name Tracking name identifier
 * @param canvas FabricCanvas instance (optional)
 * @returns Transaction object with finish method
 */
export function startCanvasTracking(
  name: string,
  canvas: FabricCanvas | null = null
): PerformanceTransaction {
  return startCanvasTransaction(`tracking.${name}`, canvas, {
    op: 'monitoring',
    longRunning: true
  });
}
