
/**
 * Central error reporting utility
 */
import { toast } from 'sonner';
import { captureMessage, captureException } from '@sentry/react';

/**
 * Error severity levels for consistent reporting
 */
export enum ErrorSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

/**
 * Standard error reporting options
 */
export interface ErrorReportingOptions {
  severity?: ErrorSeverity;
  silent?: boolean;
  metadata?: Record<string, any>;
  context?: string;
  user?: {
    id?: string;
    email?: string;
  };
}

/**
 * Default options for error reporting
 */
const defaultReportingOptions: ErrorReportingOptions = {
  severity: ErrorSeverity.MEDIUM,
  silent: false,
  metadata: {},
  context: 'application'
};

/**
 * Report an error to monitoring services and optionally display to user
 */
export function reportError(
  error: Error | string,
  options: ErrorReportingOptions = {}
): void {
  const mergedOptions = { ...defaultReportingOptions, ...options };
  const { severity, silent, metadata, context } = mergedOptions;
  
  // Normalize error to Error instance
  const errorObject = typeof error === 'string' ? new Error(error) : error;
  
  // Log to console for development
  console.error(`[${severity}] Error in ${context}:`, errorObject);
  
  // Report to monitoring service if available
  try {
    captureException(errorObject, {
      level: mapSeverityToSentryLevel(severity),
      tags: { context },
      extra: metadata
    });
  } catch (e) {
    console.error('Error reporting to monitoring service:', e);
  }
  
  // Show user notification if not silent
  if (!silent) {
    showErrorNotification(errorObject.message, severity);
  }
}

/**
 * Report a message to monitoring services
 */
export function reportMessage(
  message: string,
  options: ErrorReportingOptions = {}
): void {
  const mergedOptions = { ...defaultReportingOptions, ...options };
  const { severity, metadata, context } = mergedOptions;
  
  console.log(`[${severity}] Message from ${context}:`, message);
  
  captureMessage(message, {
    level: mapSeverityToSentryLevel(severity),
    tags: { context },
    extra: metadata
  });
}

/**
 * Show error notification to user based on severity
 */
function showErrorNotification(message: string, severity: ErrorSeverity = ErrorSeverity.MEDIUM): void {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
      toast.error(message, { duration: 8000 });
      break;
    case ErrorSeverity.HIGH:
      toast.error(message, { duration: 5000 });
      break;
    case ErrorSeverity.MEDIUM:
      toast.warning(message);
      break;
    case ErrorSeverity.LOW:
      toast.info(message);
      break;
    default:
      toast(message);
  }
}

/**
 * Map internal severity levels to Sentry levels
 */
function mapSeverityToSentryLevel(severity?: ErrorSeverity): 'fatal' | 'error' | 'warning' | 'info' {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
      return 'fatal';
    case ErrorSeverity.HIGH:
      return 'error';
    case ErrorSeverity.MEDIUM:
      return 'warning';
    case ErrorSeverity.LOW:
      return 'info';
    default:
      return 'error';
  }
}

/**
 * Create a scoped error reporter for a specific context
 */
export function createScopedErrorReporter(defaultContext: string) {
  return function(error: Error | string, options: Omit<ErrorReportingOptions, 'context'> = {}) {
    reportError(error, { ...options, context: defaultContext });
  };
}
