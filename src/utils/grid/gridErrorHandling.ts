
/**
 * Grid error handling utilities
 * @module utils/grid/gridErrorHandling
 */
import { captureError } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

/**
 * Log a grid error and capture it with Sentry
 * @param error Error object or message
 * @param context Error context
 * @param extraData Additional error data
 */
export const logGridError = (
  error: Error | string,
  context: string,
  extraData?: Record<string, unknown>
) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // Log the error
  logger.error(`Grid Error [${context}]:`, errorObj, extraData || {});
  
  // Capture the error with Sentry
  captureError(errorObj, {
    tags: { 
      component: 'Grid',
      area: 'canvas'
    },
    context: {
      errorContext: context,
      ...extraData
    },
    level: 'error'
  });
};

/**
 * Handle a grid initialization error
 * @param error Error object or message
 * @param gridId Grid identifier
 * @param extraData Additional error data
 */
export const handleGridInitError = (
  error: Error | string,
  gridId: string,
  extraData?: Record<string, unknown>
) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // Log the error
  logger.error(`Grid Initialization Error [${gridId}]:`, errorObj, extraData || {});
  
  // Capture with Sentry
  captureError(errorObj, {
    tags: { 
      component: 'Grid', 
      gridId: gridId
    },
    context: {
      errorContext: 'grid-initialization',
      ...extraData
    },
    level: 'error'
  });
};

/**
 * Create a grid error handler function
 * @param context Error context
 * @returns Error handler function
 */
export const createGridErrorHandler = (context: string) => {
  return (error: Error | string, extraData?: Record<string, unknown>) => {
    logGridError(error, context, extraData);
  };
};

export default {
  logGridError,
  handleGridInitError,
  createGridErrorHandler
};
