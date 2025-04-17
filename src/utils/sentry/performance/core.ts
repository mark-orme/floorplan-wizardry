
import * as Sentry from '@sentry/react';
import { isSentryInitialized } from '../core';
import logger from '../../logger';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Represents a performance transaction
 */
export interface PerformanceTransaction {
  name: string;
  startTime: number;
  transaction: any;
  finish: (status?: string) => void;
}

/**
 * Start a performance transaction for monitoring
 * @param name Transaction name
 * @param canvas Optional FabricCanvas instance for additional context
 * @param options Additional transaction options
 * @returns Transaction object with finish method
 */
export function startPerformanceTransaction(
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
      name,
      op: 'performance',
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
            durationMs: duration
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
