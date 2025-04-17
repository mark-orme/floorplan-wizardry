
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
  finish: (status?: string) => void; // Simplified to one argument
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
      finish: (status = 'ok') => { // Simplified to one argument
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
 * Start canvas tracking without requiring a canvas object
 * 
 * @param name - Transaction name
 * @param options - Optional transaction options
 * @returns Transaction object
 */
export function startCanvasTracking(
  name: string,
  options: Record<string, unknown> = {}
): {
  name: string;
  startTime: number;
  transaction: any;
  finish: (status?: string) => void; // Simplified to one argument
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
      finish: (status = 'ok') => { // Simplified to one argument
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
    logger.error(`Error starting canvas tracking for ${name}:`, error);
    
    return {
      name,
      startTime: performance.now(),
      transaction: null,
      finish: () => {} // No-op finish function
    };
  }
}
