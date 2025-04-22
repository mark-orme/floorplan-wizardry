
/**
 * Sentry utilities for error reporting
 * Provides backward compatibility for different captureError call patterns
 */
import * as Sentry from '@sentry/react';

// New error capture format
type ErrorOptions = {
  context?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
};

/**
 * Capture an error with Sentry
 * Supports both old format (error, context, extraData) and new format (error, options)
 */
export function captureError(
  error: Error | string,
  contextOrOptions?: string | ErrorOptions,
  legacyExtraData?: Record<string, any>
): void {
  // Handle different call patterns for backward compatibility
  if (typeof contextOrOptions === 'string' && legacyExtraData !== undefined) {
    // Legacy format: captureError(error, 'context', extraData)
    console.warn('Using deprecated captureError format. Please update to new format.');
    Sentry.captureException(error, {
      contexts: {
        error: {
          ...(typeof error === 'object' ? error : { message: error }),
        },
      },
      tags: {
        context: contextOrOptions,
      },
      extra: legacyExtraData,
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
    });
  } else if (typeof contextOrOptions === 'string') {
    // Simpler legacy format: captureError(error, 'context')
    console.warn('Using deprecated captureError format. Please update to new format.');
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
  }
}

/**
 * Capture a message with Sentry
 * Supports both old format (message, level, extraData) and new format (message, options)
 */
export function captureMessage(
  message: string,
  levelOrOptions?: Sentry.SeverityLevel | ErrorOptions,
  legacyExtraData?: Record<string, any>
): void {
  if (typeof levelOrOptions === 'string' && legacyExtraData !== undefined) {
    // Legacy format: captureMessage(message, 'level', extraData)
    console.warn('Using deprecated captureMessage format. Please update to new format.');
    Sentry.captureMessage(message, {
      level: levelOrOptions as Sentry.SeverityLevel,
      extra: legacyExtraData,
    });
  } else if (typeof levelOrOptions === 'object' || levelOrOptions === undefined) {
    // New format: captureMessage(message, { context, tags, extra })
    const options = levelOrOptions || {};
    Sentry.captureMessage(message, {
      tags: {
        ...(options.context ? { context: options.context } : {}),
        ...(options.tags || {}),
      },
      extra: options.extra || {},
    });
  } else if (typeof levelOrOptions === 'string') {
    // Simpler legacy format: captureMessage(message, 'level')
    console.warn('Using deprecated captureMessage format. Please update to new format.');
    Sentry.captureMessage(message, {
      level: levelOrOptions as Sentry.SeverityLevel,
    });
  }
}

export default {
  captureError,
  captureMessage,
};
