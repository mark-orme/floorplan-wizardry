
/**
 * Sentry utility functions for error tracking
 */

interface ErrorOptions {
  level?: 'info' | 'warning' | 'error' | 'fatal';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture a message in Sentry
 * @param message - Message to capture
 * @param options - Optional configuration
 */
export function captureMessage(message: string, options: ErrorOptions | string = {}): void {
  // Convert string option (for backward compatibility) to object
  const opts = typeof options === 'string' ? { level: options as any } : options;
  
  // In dev environment, just log to console
  if (process.env.NODE_ENV === 'development') {
    const level = opts.level || 'info';
    
    switch (level) {
      case 'info':
        console.info(`[SENTRY] ${message}`, opts.extra || {});
        break;
      case 'warning':
        console.warn(`[SENTRY] ${message}`, opts.extra || {});
        break;
      case 'error':
      case 'fatal':
        console.error(`[SENTRY] ${message}`, opts.extra || {});
        break;
      default:
        console.log(`[SENTRY] ${message}`, opts.extra || {});
    }
  }
  
  // In production, this would send to Sentry
  // Sentry.captureMessage(message, { level, tags, extra });
}

/**
 * Capture an error in Sentry
 * @param error - Error object
 * @param options - Optional configuration
 */
export function captureError(error: Error | unknown, options: ErrorOptions = {}): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // In dev environment, just log to console
  if (process.env.NODE_ENV === 'development') {
    console.error(`[SENTRY] Error: ${errorMessage}`, {
      error,
      ...options.extra
    });
  }
  
  // In production, this would send to Sentry
  // Sentry.captureException(error, { level, tags, extra });
}
