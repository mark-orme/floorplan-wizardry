
/**
 * Utility functions for Sentry error reporting
 * Provides backwards compatibility for different captureError signatures
 */
import * as Sentry from '@sentry/react';

/**
 * Capture an error with context information
 * @param error The error to capture
 * @param contextOrName Context object or name string
 * @param extraData Optional extra data (legacy format)
 */
export function captureError(
  error: Error | any,
  contextOrName?: string | Record<string, any>,
  extraData?: Record<string, any>
) {
  // Handle all different call signatures to provide backward compatibility
  if (typeof contextOrName === 'string' && extraData) {
    // Legacy format: captureError(error, 'name', { extra: 'data' })
    Sentry.captureException(error, {
      tags: { context: contextOrName },
      extra: extraData
    });
  } else if (typeof contextOrName === 'string') {
    // String context only: captureError(error, 'name')
    Sentry.captureException(error, {
      tags: { context: contextOrName }
    });
  } else if (contextOrName) {
    // New format: captureError(error, { context: 'data', extra: 'data' })
    Sentry.captureException(error, {
      tags: contextOrName.tags || { context: contextOrName.context || 'unknown' },
      extra: contextOrName.extra || contextOrName
    });
  } else {
    // Just the error: captureError(error)
    Sentry.captureException(error);
  }
}

/**
 * Capture a message with context information
 * @param message The message to capture
 * @param name Name or context identifier
 * @param data Optional extra data
 */
export function captureMessage(
  message: string,
  name?: string,
  data?: Record<string, any>
) {
  if (name && data) {
    // Legacy format: captureMessage('message', 'name', { extra: 'data' })
    Sentry.captureMessage(message, {
      level: data.level || 'info',
      tags: { context: name },
      extra: data
    });
  } else if (name) {
    // String context only: captureMessage('message', 'name')
    Sentry.captureMessage(message, {
      level: 'info',
      tags: { context: name }
    });
  } else {
    // Just the message: captureMessage('message')
    Sentry.captureMessage(message);
  }
}
