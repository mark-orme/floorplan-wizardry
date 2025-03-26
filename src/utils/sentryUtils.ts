
/**
 * Utility functions for error reporting to Sentry
 * @module sentryUtils
 */

/**
 * Options for error tracking
 * @interface CaptureErrorOptions
 */
interface CaptureErrorOptions {
  /** Tags for categorizing the error */
  tags?: Record<string, string>;
  /** Additional context information */
  extra?: Record<string, unknown>;
  /** User information */
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  /** Level of the error */
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}

/**
 * Capture and report an error to Sentry
 * @param {unknown} error - The error to capture
 * @param {string} source - Source of the error 
 * @param {CaptureErrorOptions} options - Additional options for error reporting
 */
export const captureError = (
  error: unknown,
  source: string = 'unknown',
  options: CaptureErrorOptions = {}
): void => {
  console.error(`[${source}] Error:`, error);
  
  // In development, log the error with options
  if (import.meta.env.DEV) {
    console.groupCollapsed(`Error details (${source}):`);
    console.error('Error:', error);
    console.info('Tags:', options.tags || {});
    console.info('Extra:', options.extra || {});
    console.info('User:', options.user || {});
    console.groupEnd();
  }
  
  // When Sentry is added, uncomment this code
  /*
  if (typeof window.Sentry !== 'undefined') {
    window.Sentry.captureException(error, {
      tags: { 
        ...options.tags,
        source
      },
      extra: options.extra,
      user: options.user,
      level: options.level || 'error'
    });
  }
  */
};

/**
 * Capture a message to Sentry
 * @param {string} message - The message to capture
 * @param {string} source - Source of the message
 * @param {CaptureErrorOptions} options - Additional options for message reporting
 */
export const captureMessage = (
  message: string,
  source: string = 'unknown',
  options: CaptureErrorOptions = {}
): void => {
  console.info(`[${source}] Message:`, message);
  
  // When Sentry is added, uncomment this code
  /*
  if (typeof window.Sentry !== 'undefined') {
    window.Sentry.captureMessage(message, {
      tags: { 
        ...options.tags,
        source
      },
      extra: options.extra,
      user: options.user,
      level: options.level || 'info'
    });
  }
  */
};
