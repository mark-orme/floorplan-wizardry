
/**
 * Sentry utilities for error reporting
 * @module utils/sentryUtils
 */

interface CaptureOptions {
  level?: 'error' | 'warning' | 'info';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture error for reporting
 * @param {Error} error - Error to capture
 * @param {string} errorId - Unique error identifier
 * @param {CaptureOptions} options - Capture options
 */
export const captureError = (
  error: Error,
  errorId: string,
  options: CaptureOptions = {}
): void => {
  // Log error to console
  console.error(`[${errorId}]`, error, options);
  
  // In real implementation, this would send to Sentry
  // Sentry.captureException(error, {
  //   tags: { errorId, ...options.tags },
  //   level: options.level || 'error',
  //   extra: options.extra
  // });
};
