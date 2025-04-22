
/**
 * Sentry utilities
 * Provides helper functions for capturing errors and messages in Sentry
 */
import * as Sentry from '@sentry/react';

/**
 * Error capture options interface
 */
export interface ErrorCaptureOptions {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: Sentry.SeverityLevel;
}

/**
 * Capture error in Sentry
 * @param error Error to capture
 * @param options Capture options
 */
export function captureError(error: Error, options?: ErrorCaptureOptions): void;

/**
 * Capture error in Sentry (legacy signature)
 * @param error Error to capture
 * @param context Context string (deprecated)
 * @param extraData Extra data (deprecated)
 * @deprecated Use the options object signature instead
 */
export function captureError(error: Error, context?: string, extraData?: Record<string, any>): void;

/**
 * Implementation of captureError
 */
export function captureError(
  error: Error, 
  contextOrOptions?: string | ErrorCaptureOptions, 
  extraData?: Record<string, any>
): void {
  if (typeof contextOrOptions === 'string') {
    // Legacy implementation with 3 args
    console.warn('Using deprecated captureError signature. Please update to options object.');
    Sentry.captureException(error, {
      tags: { context: contextOrOptions },
      extra: extraData
    });
  } else {
    // New implementation with options object
    Sentry.captureException(error, {
      tags: contextOrOptions?.tags,
      extra: contextOrOptions?.extra,
      level: contextOrOptions?.level
    });
  }
}

/**
 * Message capture options interface
 */
export interface MessageCaptureOptions {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: Sentry.SeverityLevel;
}

/**
 * Capture message in Sentry
 * @param message Message to capture
 * @param options Capture options
 */
export function captureMessage(message: string, options?: MessageCaptureOptions): void;

/**
 * Capture message in Sentry (legacy signature)
 * @param message Message to capture
 * @param context Context string (deprecated)
 * @param extraData Extra data (deprecated)
 * @deprecated Use the options object signature instead
 */
export function captureMessage(message: string, context?: string, extraData?: Record<string, any>): void;

/**
 * Implementation of captureMessage
 */
export function captureMessage(
  message: string, 
  contextOrOptions?: string | MessageCaptureOptions, 
  extraData?: Record<string, any>
): void {
  if (typeof contextOrOptions === 'string') {
    // Legacy implementation with 3 args
    console.warn('Using deprecated captureMessage signature. Please update to options object.');
    Sentry.captureMessage(message, {
      tags: { context: contextOrOptions },
      extra: extraData
    });
  } else {
    // New implementation with options object
    Sentry.captureMessage(message, {
      tags: contextOrOptions?.tags,
      extra: contextOrOptions?.extra,
      level: contextOrOptions?.level
    });
  }
}
