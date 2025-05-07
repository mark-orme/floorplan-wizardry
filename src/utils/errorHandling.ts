
/**
 * Central error handling utility
 */
import { ErrorSeverity, reportError } from './errorReporting';
import { toast } from 'sonner';

interface ErrorContext {
  component?: string;
  operation?: string;
  context?: Record<string, any>;
}

type ErrorSeverityLevel = 'critical' | 'error' | 'warning' | 'info';

/**
 * Map severity level to ErrorSeverity enum
 */
function mapSeverityLevel(severity: ErrorSeverityLevel): ErrorSeverity {
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
 * Handle errors with consistent reporting and user feedback
 */
export function handleError(
  error: Error | string,
  severity: ErrorSeverityLevel = 'error',
  context: ErrorContext = {}
): void {
  // Map severity to ErrorSeverity enum
  const errorSeverity = mapSeverityLevel(severity);

  // Report the error using consistent structure
  reportError(error, {
    severity: errorSeverity,
    silent: false,
    metadata: context,
    context: context.component || 'app'
  });
  
  // Show appropriate user feedback based on severity
  if (severity === 'critical') {
    toast.error('A critical error occurred. Please reload the application.', {
      duration: 5000
    });
  } else if (severity === 'error') {
    toast.error(typeof error === 'string' ? error : error.message);
  } else if (severity === 'warning') {
    toast.warning(typeof error === 'string' ? error : error.message);
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
