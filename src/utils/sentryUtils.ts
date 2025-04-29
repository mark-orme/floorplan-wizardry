
/**
 * Utility functions for error reporting
 */

/**
 * Capture a message to the error reporting system
 */
export const captureMessage = (
  message: string,
  options?: {
    level?: 'info' | 'warning' | 'error',
    tags?: Record<string, string>,
    extra?: Record<string, any>
  }
) => {
  console.log(`[REPORTING] ${options?.level || 'info'}: ${message}`);
  
  // In a real app, this would send to Sentry or similar
  // Sentry.captureMessage(message, {
  //   level: options?.level || 'info',
  //   tags: options?.tags,
  //   extra: options?.extra
  // });
};

/**
 * Capture an error to the error reporting system
 */
export const captureError = (
  error: Error,
  options?: {
    tags?: Record<string, string>,
    extra?: Record<string, any>
  }
) => {
  console.error(`[REPORTING] Error: ${error.message}`, error);
  
  // In a real app, this would send to Sentry or similar
  // Sentry.captureException(error, {
  //   tags: options?.tags,
  //   extra: options?.extra
  // });
};
