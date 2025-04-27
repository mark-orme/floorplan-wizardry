
/**
 * Sentry utilities for error reporting
 */

interface CaptureOptions {
  level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture a message for Sentry monitoring
 * @param message The message to capture
 * @param options Capture options
 */
export function captureMessage(message: string, options: CaptureOptions = {}) {
  // In development, just log to console
  if (process.env.NODE_ENV === 'development') {
    const level = options.level || 'info';
    console[level === 'error' || level === 'fatal' ? 'error' : level === 'warning' ? 'warn' : 'log'](
      `[${level.toUpperCase()}] ${message}`,
      options.extra || {}
    );
    return;
  }
  
  // In production, this would use actual Sentry SDK
  // Sentry.captureMessage(message, {
  //   level: options.level || 'info',
  //   tags: options.tags,
  //   extra: options.extra
  // });
}

/**
 * Capture an error for Sentry monitoring
 * @param error The error to capture
 * @param options Capture options
 */
export function captureError(error: Error, options: CaptureOptions = {}) {
  // In development, just log to console
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${error.message}`, error, options.extra || {});
    return;
  }
  
  // In production, this would use actual Sentry SDK
  // Sentry.captureException(error, {
  //   level: options.level || 'error',
  //   tags: options.tags,
  //   extra: options.extra
  // });
}
