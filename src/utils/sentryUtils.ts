
/**
 * Sentry utilities
 * Provides helper functions for capturing errors and messages in Sentry
 */
import * as Sentry from '@sentry/react';

/**
 * Capture error in Sentry
 * @param error Error to capture
 * @param contextOrOptions Context string or options
 * @param extraData Extra data (deprecated, use options instead)
 */
export function captureError(
  error: Error, 
  contextOrOptions?: string | Record<string, any>,
  extraData?: Record<string, any>
): void {
  // Handle the different function signatures
  if (typeof contextOrOptions === 'string') {
    Sentry.captureException(error, {
      tags: { context: contextOrOptions },
      extra: extraData
    });
  } else if (contextOrOptions && typeof contextOrOptions === 'object') {
    // New style: passing options directly
    Sentry.captureException(error, contextOrOptions);
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture message in Sentry
 * @param message Message to capture
 * @param contextOrOptions Context string or options
 * @param extraData Extra data (deprecated, use options instead)
 */
export function captureMessage(
  message: string, 
  contextOrOptions?: string | Record<string, any>,
  extraData?: Record<string, any>
): void {
  // Handle the different function signatures
  if (typeof contextOrOptions === 'string') {
    Sentry.captureMessage(message, {
      tags: { context: contextOrOptions },
      extra: extraData
    });
  } else if (contextOrOptions && typeof contextOrOptions === 'object') {
    // New style: passing options directly
    Sentry.captureMessage(message, contextOrOptions);
  } else {
    Sentry.captureMessage(message);
  }
}
