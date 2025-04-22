
/**
 * Utility functions for Sentry error reporting
 * Provides backwards compatibility for different captureError signatures
 */
import * as Sentry from '@sentry/react';

/**
 * Capture an error with context information
 * @param error The error to capture
 * @param contextOrName Context object or name string
 * @param extraData Additional context data (optional)
 */
export function captureError(
  error: Error | any,
  contextOrName?: string | Record<string, any>,
  extraData?: Record<string, any> // Added third parameter to support legacy calls
) {
  // Handle all different call signatures to provide backward compatibility
  if (extraData && typeof contextOrName === 'string') {
    // Handle 3-argument legacy case: captureError(error, 'name', { extra: data })
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
 * @param nameOrContext Name, context identifier, or context object
 * @param extraData Additional context data (optional)
 */
export function captureMessage(
  message: string,
  nameOrContext?: string | Record<string, any>,
  extraData?: Record<string, any> // Added third parameter to support legacy calls
) {
  if (extraData && typeof nameOrContext === 'string') {
    // Handle 3-argument legacy case: captureMessage('message', 'name', { extra: data })
    Sentry.captureMessage(message, {
      level: extraData.level || 'info',
      tags: { context: nameOrContext },
      extra: extraData
    });
  } else if (typeof nameOrContext === 'string') {
    // String context only: captureMessage('message', 'name')
    Sentry.captureMessage(message, {
      level: 'info',
      tags: { context: nameOrContext }
    });
  } else if (nameOrContext && typeof nameOrContext === 'object') {
    // Object context: captureMessage('message', { context: 'data', extra: 'data' })
    Sentry.captureMessage(message, {
      level: nameOrContext.level || 'info',
      tags: nameOrContext.tags || { context: nameOrContext.context || 'unknown' },
      extra: nameOrContext.extra || nameOrContext
    });
  } else {
    // Just the message: captureMessage('message')
    Sentry.captureMessage(message);
  }
}

/**
 * Capture error with enhanced monitoring data
 * Used for critical error paths that need additional context
 */
export function captureErrorWithMonitoring(
  error: Error | any,
  contextName: string,
  monitoringTag: string,
  additionalContext?: Record<string, any>
) {
  // Map to two-parameter signature for backward compatibility
  const context = {
    context: contextName,
    tags: {
      monitoring: monitoringTag,
      ...(additionalContext?.tags || {})
    },
    extra: additionalContext?.extra || additionalContext
  };
  
  captureError(error, context);
}
