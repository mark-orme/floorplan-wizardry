
/**
 * Consolidated error handling utilities
 * Provides consistent error handling patterns across the application
 */

import { ErrorSeverity, reportError } from './errorReporting';
import { toast } from 'sonner';
import { captureError } from './sentryUtils';

/**
 * Standard error context interface
 */
export interface ErrorContext {
  component?: string;
  operation?: string;
  context?: Record<string, any>;
}

/**
 * Normalized error severity levels
 */
export type ErrorSeverityLevel = 'critical' | 'error' | 'warning' | 'info';

/**
 * Map severity level to ErrorSeverity enum
 */
export function mapSeverityLevel(severity: ErrorSeverityLevel): ErrorSeverity {
  switch (severity) {
    case 'critical':
      return ErrorSeverity.CRITICAL;
    case 'error':
      return ErrorSeverity.HIGH;
    case 'warning':
      return ErrorSeverity.MEDIUM;
    case 'info':
      return ErrorSeverity.LOW;
    default:
      return ErrorSeverity.MEDIUM;
  }
}

/**
 * Map severity level to Sentry level
 */
export function mapToSentryLevel(severity: ErrorSeverityLevel): 'fatal' | 'error' | 'warning' | 'info' {
  switch (severity) {
    case 'critical':
      return 'fatal';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'info';
  }
}

/**
 * Handle errors with consistent reporting and user feedback
 */
export function handleError(
  error: Error | string,
  severity: ErrorSeverityLevel = 'error',
  context: ErrorContext = {}
): void {
  // Map severity to ErrorSeverity enum
  const errorSeverity = mapSeverityLevel(severity);
  
  // Get error message
  const errorMessage = typeof error === 'string' ? error : error.message;

  // Report the error using consistent structure
  reportError(error, {
    severity: errorSeverity,
    silent: false,
    metadata: context,
    context: context.component || 'app'
  });
  
  // Send to Sentry if available
  captureError(typeof error === 'string' ? new Error(error) : error, {
    level: mapToSentryLevel(severity),
    tags: {
      component: context.component || 'unknown',
      operation: context.operation || 'unknown'
    },
    context: context.context
  });
  
  // Show appropriate user feedback based on severity
  if (severity === 'critical') {
    toast.error('A critical error occurred. Please reload the application.', {
      duration: 5000
    });
  } else if (severity === 'error') {
    toast.error(errorMessage);
  } else if (severity === 'warning') {
    toast.warning(errorMessage);
  }
}

/**
 * Try to perform an operation with error handling
 */
export async function trySafely<T>(
  operation: () => Promise<T> | T,
  errorContext: ErrorContext
): Promise<T | null> {
  try {
    const result = await operation();
    return result;
  } catch (error: unknown) {
    handleError(
      error instanceof Error ? error : new Error(String(error)),
      'error',
      errorContext
    );
    return null;
  }
}

/**
 * Safely handle unknown error types
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  return new Error(`Unknown error: ${JSON.stringify(error)}`);
}

/**
 * Create a scoped error handler for specific components
 */
export function createScopedErrorHandler(defaultContext: ErrorContext) {
  return function(error: unknown, severity: ErrorSeverityLevel = 'error', additionalContext: Partial<ErrorContext> = {}) {
    const normalizedError = normalizeError(error);
    const mergedContext = { ...defaultContext, ...additionalContext };
    
    handleError(normalizedError, severity, mergedContext);
    return normalizedError;
  };
}
