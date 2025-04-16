
/**
 * Canvas error reporting utilities
 * @module utils/canvas/monitoring/errorReporting
 */
import * as Sentry from '@sentry/react';
import { ErrorCategory, ErrorSeverity, CanvasErrorInfo } from './errorTypes';
import { logger } from '../../logger';

/**
 * Report a canvas error to monitoring systems
 * @param error Error object or message
 * @param category Error category
 * @param severity Error severity
 * @param context Additional context
 */
export function reportCanvasError(
  error: Error | string,
  category: ErrorCategory = ErrorCategory.OTHER,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context: Record<string, any> = {}
): void {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const stack = typeof error === 'string' ? undefined : error.stack;
  
  const errorInfo: CanvasErrorInfo = {
    message: errorMessage,
    category,
    severity,
    stack,
    timestamp: Date.now(),
    context
  };
  
  // Log to console based on severity
  switch (severity) {
    case ErrorSeverity.LOW:
      logger.debug(`Canvas Error [${category}]: ${errorMessage}`, context);
      break;
    case ErrorSeverity.MEDIUM:
      logger.warn(`Canvas Error [${category}]: ${errorMessage}`, context);
      break;
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      logger.error(`Canvas Error [${category}]: ${errorMessage}`, context);
      break;
  }
  
  // Report to Sentry for medium+ severity
  if (severity !== ErrorSeverity.LOW) {
    Sentry.captureException(typeof error === 'string' ? new Error(error) : error, {
      tags: {
        category,
        severity
      },
      extra: context
    });
  }
}
