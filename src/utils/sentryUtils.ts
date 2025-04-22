
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
  level?: 'info' | 'warning' | 'error' | 'fatal';
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  extra?: Record<string, any>;
}

/**
 * Capture an error with context information
 * Supports both legacy and new call signatures:
 * - captureError(error)
 * - captureError(error, 'contextName')
 * - captureError(error, { tags, extra })
 * - captureError(error, 'contextName', extraData) (legacy)
 * 
 * @param error The error to capture
 * @param contextOrOptions Context string or options object
 * @param extraData Additional context data (legacy parameter)
 */
export function captureError(
  error: Error | any,
  contextOrOptions?: string | Record<string, any>,
  extraData?: Record<string, any> // Legacy parameter
) {
  // Handle all different call signatures to provide backward compatibility
  if (extraData && typeof contextOrOptions === 'string') {
    // Handle 3-argument legacy case: captureError(error, 'name', { extra: data })
    Sentry.captureException(error, {
      tags: { context: contextOrOptions },
      extra: extraData
    });
  } else if (typeof contextOrOptions === 'string') {
    // String context only: captureError(error, 'name')
    Sentry.captureException(error, {
      tags: { context: contextOrOptions }
    });
  } else if (contextOrOptions && typeof contextOrOptions === 'object') {
    // New format: captureError(error, { tags: {}, context: 'data', extra: 'data' })
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
 * Supports both legacy and new call signatures:
 * - captureMessage(message)
 * - captureMessage(message, 'contextName')
 * - captureMessage(message, { tags, extra })
 * - captureMessage(message, 'contextName', extraData) (legacy)
 * 
 * @param message The message to capture
 * @param contextOrOptions Context string or options object
 * @param extraData Additional context data (legacy parameter)
 */
export function captureMessage(
  message: string,
  contextOrOptions?: string | Record<string, any>,
  extraData?: Record<string, any> // Legacy parameter
) {
  // Handle all different call signatures to provide backward compatibility
  if (extraData && typeof contextOrOptions === 'string') {
    // Handle 3-argument legacy case: captureMessage('message', 'name', { extra: data })
    Sentry.captureMessage(message, {
      level: (extraData.level as Sentry.SeverityLevel) || 'info',
      tags: { context: contextOrOptions },
      extra: extraData
    });
  } else if (typeof contextOrOptions === 'string') {
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
