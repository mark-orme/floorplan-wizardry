
/**
 * Canvas-specific Sentry performance monitoring utilities
 * @module utils/sentry/performance/canvas
 */
import * as Sentry from '@sentry/react';
import { Canvas as FabricCanvas } from 'fabric';
import { isSentryInitialized } from '../core';
import logger from '../../logger';

/**
 * Start a canvas performance transaction
 * 
 * @param name - Transaction name (required)
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

/**
 * Ensure a default canvas transaction method that works even without a canvas
 * 
 * @param name - Transaction name
 * @returns Transaction object
 */
export function startCanvasTracking(name: string) {
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
      op: 'performance'
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
            ...data
          });

          transaction.status = status;
          transaction.finish();
        }
      }
    };
  } catch (error) {
    logger.error(`Error starting canvas tracking for ${name}:`, error);
    
    return {
      name,
      startTime: performance.now(),
      transaction: null,
      finish: () => {} // No-op finish function
    };
  }
}
