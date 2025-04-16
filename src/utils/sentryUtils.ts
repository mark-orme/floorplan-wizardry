
/**
 * Utility functions for Sentry error reporting
 * @module utils/sentryUtils
 */

/**
 * Capture an error in Sentry
 * @param error The error to capture
 * @param contextId Optional identifier for the error context
 * @param additionalData Optional additional context data
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
 * @param levelOrId The severity level or a context identifier
 * @param contextData Optional additional context data
 */
export const captureMessage = (
  message: string,
  levelOrId: 'info' | 'warning' | 'error' | string = 'info',
  contextData?: Record<string, any>
): void => {
  // Determine if the second parameter is a severity level or an identifier
  const isLevel = ['info', 'warning', 'error'].includes(levelOrId);
  
  if (isLevel) {
    console[levelOrId as 'info' | 'warning' | 'error']('Message captured:', message, contextData);
  } else {
    // If it's an identifier, use info level by default
    console.info('Message captured:', message, levelOrId, contextData);
  }
  // In a real implementation, this would send the message to Sentry
};
