
/**
 * Sentry utilities for error tracking
 */

/**
 * Capture message in Sentry
 * @param message Message to capture
 * @param options Additional options
 */
export const captureMessage = (message: string, options?: any) => {
  // In a real implementation, this would send to Sentry
  console.log('[Sentry] Message:', message, options);
};

/**
 * Capture error in Sentry
 * @param error Error object or message
 * @param context Additional context
 */
export const captureError = (error: Error | string, context?: Record<string, any>) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // In a real implementation, this would send to Sentry
  console.error('[Sentry] Error:', errorObj, context);
};

/**
 * Start transaction in Sentry
 * @param name Transaction name
 * @param options Additional options
 */
export const startTransaction = (name: string, options?: any) => {
  // In a real implementation, this would start a Sentry transaction
  console.log('[Sentry] Start Transaction:', name, options);
  
  return {
    finish: (status?: string) => {
      console.log('[Sentry] Finish Transaction:', name, status);
    }
  };
};
