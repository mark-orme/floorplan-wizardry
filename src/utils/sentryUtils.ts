
/**
 * Sentry Utils
 * Utilities for error reporting with Sentry
 * @module utils/sentryUtils
 */

interface CaptureOptions {
  level?: 'info' | 'warning' | 'error' | 'fatal';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture a message for error tracking
 * @param message Message to capture
 * @param options Capture options
 */
export function captureMessage(message: string, options: CaptureOptions = {}) {
  // This is a stub implementation since Sentry is not actually integrated
  console.log(`[${options.level || 'info'}] ${message}`, {
    tags: options.tags || {},
    extra: options.extra || {}
  });
}

/**
 * Capture an exception for error tracking
 * @param error Error to capture
 * @param options Capture options
 */
export function captureException(error: Error, options: CaptureOptions = {}) {
  // This is a stub implementation since Sentry is not actually integrated
  console.error(`[${options.level || 'error'}] ${error.message}`, {
    tags: options.tags || {},
    extra: {
      ...(options.extra || {}),
      stack: error.stack,
    }
  });
}

/**
 * Start a transaction for performance monitoring
 * @param name Transaction name
 * @param options Transaction options
 * @returns Transaction object
 */
export function startTransaction(name: string, options: any = {}) {
  // This is a stub implementation since Sentry is not actually integrated
  const startTime = Date.now();
  return {
    finish: (status = 'ok') => {
      const duration = Date.now() - startTime;
      console.log(`Transaction ${name} finished with status ${status} after ${duration}ms`);
    }
  };
}
