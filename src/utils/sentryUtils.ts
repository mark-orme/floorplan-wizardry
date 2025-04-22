
/**
 * Sentry utilities for error reporting
 * Provides backward compatibility for different captureError call patterns
 */
import * as Sentry from '@sentry/react';

// New error capture format
export interface ErrorOptions {
  context?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: Sentry.User;
  severity?: Sentry.SeverityLevel;
}

/**
 * Capture an error with Sentry
 * Supports both old format (error, context, extraData) and new format (error, options)
 */
export function captureError(
  error: Error | string,
  contextOrOptions?: string | ErrorOptions
): void {
  // Handle different call patterns for backward compatibility
  if (typeof contextOrOptions === 'string') {
    // Format: captureError(error, 'context')
    Sentry.captureException(error, {
      contexts: {
        error: {
          ...(typeof error === 'object' ? error : { message: error }),
        },
      },
      tags: {
        context: contextOrOptions,
      },
    });
  } else if (typeof contextOrOptions === 'object' || contextOrOptions === undefined) {
    // New format: captureError(error, { context, tags, extra })
    const options = contextOrOptions || {};
    Sentry.captureException(error, {
      contexts: {
        error: {
          ...(typeof error === 'object' ? error : { message: error }),
        },
      },
      tags: {
        ...(options.context ? { context: options.context } : {}),
        ...(options.tags || {}),
      },
      extra: options.extra || {},
      user: options.user,
      level: options.severity,
    });
  }
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(
  message: string,
  optionsOrSeverity?: Sentry.SeverityLevel | ErrorOptions
): void {
  if (typeof optionsOrSeverity === 'string') {
    // String severity level format: captureMessage(message, 'info')
    Sentry.captureMessage(message, {
      level: optionsOrSeverity as Sentry.SeverityLevel,
    });
  } else if (typeof optionsOrSeverity === 'object' || optionsOrSeverity === undefined) {
    // Object options format: captureMessage(message, { context, tags, extra })
    const options = optionsOrSeverity || {};
    Sentry.captureMessage(message, {
      tags: {
        ...(options.context ? { context: options.context } : {}),
        ...(options.tags || {}),
      },
      extra: options.extra || {},
      user: options.user,
      level: options.severity,
    });
  }
}

export default {
  captureError,
  captureMessage,
};
