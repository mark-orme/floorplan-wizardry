
/**
 * Sentry utilities
 * Provides helper functions for capturing errors and messages in Sentry
 */
import * as Sentry from '@sentry/react';

/**
 * Capture error in Sentry
 * @param error Error to capture
 * @param context Context string
 * @param extraData Extra data
 */
export function captureError(error: Error, context?: string, extraData?: Record<string, any>): void {
  Sentry.captureException(error, {
    tags: context ? { context } : undefined,
    extra: extraData
  });
}

/**
 * Capture message in Sentry
 * @param message Message to capture
 * @param context Context string
 * @param extraData Extra data
 */
export function captureMessage(message: string, context?: string, extraData?: Record<string, any>): void {
  Sentry.captureMessage(message, {
    tags: context ? { context } : undefined,
    extra: extraData
  });
}
