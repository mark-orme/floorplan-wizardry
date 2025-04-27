
/**
 * Sentry utils for error handling
 * @module utils/sentryUtils
 */

/**
 * Capture error and send to monitoring service
 * 
 * @param {Error} error - Error to capture
 * @param {Record<string, any>} [context] - Additional context data
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
  // This is a stub for now - in a real app, would connect to Sentry
  console.error('Error captured:', error.message, context);
};

/**
 * Log warning to monitoring service
 * 
 * @param {string} message - Warning message
 * @param {Record<string, any>} [context] - Additional context data
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  // This is a stub for now - in a real app, would connect to Sentry
  console.warn('Warning:', message, context);
};
