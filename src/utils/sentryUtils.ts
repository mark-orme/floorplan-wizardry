
/**
 * Utility functions for Sentry error reporting
 * Provides backwards compatibility for different captureError signatures
 */
import * as Sentry from '@sentry/react';

/**
 * Capture an error with context information
 * @param error The error to capture
 * @param contextOrName Context object or name string
 */
export function captureError(
  error: Error | any,
  contextOrName?: string | Record<string, any>
) {
  // Handle all different call signatures to provide backward compatibility
  if (typeof contextOrName === 'string') {
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
 */
export function captureMessage(
  message: string,
  name?: string,
  data?: Record<string, any>
) {
  if (name && data) {
    // Legacy format: We'll convert to the new format
    return captureMessage(message, {
      context: name,
      level: data.level || 'info',
      tags: { context: name },
      extra: data
    });
  } else if (typeof name === 'string') {
    // String context only: captureMessage('message', 'name')
    Sentry.captureMessage(message, {
      level: 'info',
      tags: { context: name }
    });
  } else if (name && typeof name === 'object') {
    // Object context: captureMessage('message', { context: 'data', extra: 'data' })
    Sentry.captureMessage(message, {
      level: name.level || 'info',
      tags: name.tags || { context: name.context || 'unknown' },
      extra: name.extra || name
    });
  } else {
    // Just the message: captureMessage('message')
    Sentry.captureMessage(message);
  }
}
