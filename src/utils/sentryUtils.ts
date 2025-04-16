
/**
 * Utility functions for Sentry error reporting
 * @module utils/sentryUtils
 */

/**
 * Capture an error in Sentry
 * @param error The error to capture
 * @param context Optional additional context
 */
export const captureError = (
  error: Error, 
  contextId?: string,
  additionalData?: Record<string, any>
): void => {
  console.error('Error captured:', error, contextId, additionalData);
  // In a real implementation, this would send the error to Sentry
};

/**
 * Capture a message in Sentry
 * @param message The message to capture
 * @param level The severity level
 * @param context Optional additional context
 */
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  contextId?: string,
  additionalData?: Record<string, any>
): void => {
  console[level]('Message captured:', message, contextId, additionalData);
  // In a real implementation, this would send the message to Sentry
};
