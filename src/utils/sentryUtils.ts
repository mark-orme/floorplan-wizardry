
/**
 * Utility functions for Sentry error reporting
 * Provides backwards compatibility for different captureError signatures
 */
import * as Sentry from '@sentry/react';

/**
 * Interface for capture error options
 */
export interface CaptureErrorOptions {
  context?: string | Record<string, any>;
  tags?: Record<string, string>;
  level?: 'info' | 'warning' | 'error' | 'fatal';
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  extra?: Record<string, any>;
  showDialog?: boolean;
}

/**
 * Interface for capture message options
 */
export interface CaptureMessageOptions {
  context?: string | Record<string, any>;
  tags?: Record<string, string>;
  level?: Sentry.SeverityLevel;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  extra?: Record<string, any>;
}

/**
 * Legacy compatibility function that handles the old 3-argument pattern
 * @param error The error to capture
 * @param context Context string 
 * @param extraData Additional data
 */
export function captureError(
  error: Error | any,
  context?: string | Record<string, any>,
  extraData?: Record<string, any>
) {
  // Handle different call signatures to provide backward compatibility
  if (typeof context === 'string' && extraData) {
    // Old pattern: captureError(error, 'contextName', { extra: 'data' })
    Sentry.captureException(error, {
      tags: { context: context },
      extra: extraData
    });
  } else if (typeof context === 'string') {
    // String context only: captureError(error, 'name')
    Sentry.captureException(error, {
      tags: { context: context }
    });
  } else if (context && typeof context === 'object') {
    // Object context: captureError(error, { tags: {}, context: 'data', extra: 'data' })
    Sentry.captureException(error, {
      tags: context.tags || { context: context.context || 'unknown' },
      extra: context.extra || context
    });
  } else {
    // Just the error: captureError(error)
    Sentry.captureException(error);
  }
}

/**
 * Legacy compatibility function that handles the old 3-argument pattern 
 * @param message The message to capture
 * @param context Context string
 * @param extraData Additional data
 */
export function captureMessage(
  message: string,
  context?: string | Record<string, any>,
  extraData?: Record<string, any>
) {
  // Handle different call signatures to provide backward compatibility
  if (typeof context === 'string' && extraData) {
    // Old pattern: captureMessage('message', 'contextName', { extra: 'data' })
    Sentry.captureMessage(message, {
      level: 'info',
      tags: { context: context },
      extra: extraData
    });
  } else if (typeof context === 'string') {
    // String context only: captureMessage('message', 'name')
    Sentry.captureMessage(message, {
      level: 'info',
      tags: { context: context }
    });
  } else if (context && typeof context === 'object') {
    // Object context: captureMessage('message', { level: 'info', context: 'data', extra: 'data' })
    Sentry.captureMessage(message, {
      level: (context.level as Sentry.SeverityLevel) || 'info',
      tags: context.tags || { context: context.context || 'unknown' },
      extra: context.extra || context
    });
  } else {
    // Just the message: captureMessage('message')
    Sentry.captureMessage(message);
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use captureErrorWithMonitoring instead
 */
export function captureErrorWithMonitoring(
  error: Error | any,
  contextName: string,
  monitoringTag: string,
  additionalContext?: Record<string, any>
) {
  captureError(error, {
    tags: { context: contextName, monitoring: monitoringTag },
    extra: additionalContext
  });
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use captureMessage with options object instead
 */
export function captureMessageWithMonitoring(
  message: string,
  contextName: string,
  monitoringTag: string,
  additionalContext?: Record<string, any>
) {
  captureMessage(message, {
    tags: { context: contextName, monitoring: monitoringTag },
    extra: additionalContext
  });
}
