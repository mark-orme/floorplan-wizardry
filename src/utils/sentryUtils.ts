
/**
 * Sentry utility functions for error logging
 */

/**
 * Capture a message in Sentry
 */
export const captureMessage = (message: string, options?: {
  level?: 'info' | 'warning' | 'error',
  tags?: Record<string, string>,
  extra?: Record<string, any>
}) => {
  console.log(`[Sentry] ${message}`, options);
};

/**
 * Capture an exception in Sentry
 */
export const captureException = (error: Error, options?: {
  tags?: Record<string, string>,
  extra?: Record<string, any>
}) => {
  console.error(`[Sentry] Exception:`, error, options);
};

/**
 * Initialize Sentry
 */
export const initSentry = () => {
  console.log('[Sentry] Initialized');
};
