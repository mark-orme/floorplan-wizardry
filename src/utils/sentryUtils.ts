
/**
 * Sentry Utilities
 * Provides error reporting functionality
 * @module utils/sentryUtils
 */

interface CaptureErrorOptions {
  level?: 'error' | 'warning' | 'info';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture error for reporting
 * @param {Error | any} error - The error to capture
 * @param {string} [errorId] - Optional identifier for the error
 * @param {CaptureErrorOptions} [options] - Additional capture options
 */
export const captureError = (
  error: Error | any,
  errorId?: string,
  options?: CaptureErrorOptions
): void => {
  // Log error to console in all environments for debugging
  console.error(`Error captured${errorId ? ` (${errorId})` : ''}:`, error, options || {});
  
  // In production, we would send to Sentry here
  // This is a placeholder implementation
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // If Sentry is initialized, we would report here
    // Sentry.captureException(error, {
    //   tags: { errorId, ...(options?.tags || {}) },
    //   level: options?.level || 'error',
    //   extra: options?.extra || {}
    // });
  }
};

/**
 * Track error metrics
 * @param {string} category - Error category
 * @param {string} action - Error action
 * @param {Record<string, any>} [data] - Additional tracking data
 */
export const trackErrorMetric = (
  category: string,
  action: string,
  data?: Record<string, any>
): void => {
  console.info(`Error metric: ${category}/${action}`, data || {});
  
  // In production, would send to analytics/monitoring
};
