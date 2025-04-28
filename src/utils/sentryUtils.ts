
/**
 * Simple Sentry utility functions
 */

interface CaptureOptions {
  level?: 'info' | 'warning' | 'error' | 'fatal';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture a message for monitoring
 */
export function captureMessage(message: string, options: CaptureOptions = {}) {
  // In a real implementation, this would use Sentry.captureMessage
  // For now, just log to console with some formatting
  const { level = 'info', tags = {}, extra = {} } = options;
  
  console[level === 'fatal' ? 'error' : level](`[${level.toUpperCase()}] ${message}`, {
    tags,
    extra
  });
}

/**
 * Capture an error for monitoring
 */
export function captureException(error: Error, options: CaptureOptions = {}) {
  // In a real implementation, this would use Sentry.captureException
  // For now, just log to console with some formatting
  const { level = 'error', tags = {}, extra = {} } = options;
  
  console.error(`[${level.toUpperCase()}] Error:`, error, {
    tags,
    extra
  });
}

/**
 * Add a breadcrumb for error tracking
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  // In a real implementation, this would use Sentry.addBreadcrumb
  // For now, just log to console
  console.debug(`[BREADCRUMB][${category}] ${message}`, data || {});
}
