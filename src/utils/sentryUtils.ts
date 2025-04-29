
/**
 * Utility functions for Sentry error reporting
 */

/**
 * Options for error capture
 */
export interface CaptureErrorOptions {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}

/**
 * Capture an error in Sentry
 */
export const captureError = (error: Error, options: CaptureErrorOptions = {}) => {
  // In a real application, this would send to Sentry
  console.error('Error captured:', error, options);
};

/**
 * Capture a message in Sentry
 */
export const captureMessage = (message: string, options: CaptureErrorOptions = {}) => {
  // In a real application, this would send to Sentry
  console.log('Message captured:', message, options);
};

/**
 * Set user context for Sentry
 */
export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  // In a real application, this would set user context in Sentry
  console.log('User context set:', user);
};
