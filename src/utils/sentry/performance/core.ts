
import * as Sentry from '@sentry/react';
import { isSentryInitialized } from '../core';
import logger from '../../logger';

export function startPerformanceTransaction(
  name: string,
  options: Record<string, unknown> = {}
): {
  name: string;
  startTime: number;
  transaction: any;
  finish: (status?: string) => void;
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
      name,
      op: 'performance',
      ...options
    });
    
    const startTime = performance.now();
    
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
