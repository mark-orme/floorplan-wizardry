
/**
 * Utility functions for Sentry error reporting
 * Provides backwards compatibility for different captureError signatures
 */
import * as Sentry from '@sentry/react';

/**
 * Interface for capture error options
 */
export interface CaptureErrorOptions {
  context?: Record<string, any>;
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
  context?: Record<string, any>;
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
 * Capture an error with context information
 * @param error The error to capture
 * @param contextOrOptions Context string or options object (optional)
 */
export function captureError(
  error: Error | any,
  contextOrOptions?: string | Record<string, any>
) {
  // Handle different call signatures to provide backward compatibility
  if (typeof contextOrOptions === 'string') {
    // String context only: captureError(error, 'name')
    Sentry.captureException(error, {
      tags: { context: contextOrOptions }
    });
  } else if (contextOrOptions && typeof contextOrOptions === 'object') {
    // Object context: captureError(error, { tags: {}, context: 'data', extra: 'data' })
    Sentry.captureException(error, {
      tags: contextOrOptions.tags || { context: contextOrOptions.context || 'unknown' },
      extra: contextOrOptions.extra || contextOrOptions
    });
  } else {
    // Just the error: captureError(error)
    Sentry.captureException(error);
  }
}

/**
 * Capture a message with context information
 * @param message The message to capture
 * @param contextOrOptions Context string or options object (optional)
 */
export function captureMessage(
  message: string,
  contextOrOptions?: string | Record<string, any>
) {
  // Handle different call signatures to provide backward compatibility
  if (typeof contextOrOptions === 'string') {
    // String context only: captureMessage('message', 'name')
    Sentry.captureMessage(message, {
      level: 'info',
      tags: { context: contextOrOptions }
    });
  } else if (contextOrOptions && typeof contextOrOptions === 'object') {
    // Object context: captureMessage('message', { level: 'info', context: 'data', extra: 'data' })
    Sentry.captureMessage(message, {
      level: (contextOrOptions.level as Sentry.SeverityLevel) || 'info',
      tags: contextOrOptions.tags || { context: contextOrOptions.context || 'unknown' },
      extra: contextOrOptions.extra || contextOrOptions
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
