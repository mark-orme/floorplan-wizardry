
/**
 * Central error reporting utility
 * Provides consistent error reporting across the application
 */
import { toast } from 'sonner';

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error context interface
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Error options interface
export interface ErrorReportOptions {
  notify?: boolean; // Whether to show a toast notification
  log?: boolean; // Whether to log to console
  report?: boolean; // Whether to report to error tracking service
  severity?: ErrorSeverity; // Error severity level
}

// Default options
const defaultOptions: ErrorReportOptions = {
  notify: true,
  log: true,
  report: true,
  severity: ErrorSeverity.ERROR
};

/**
 * Report an error
 * @param error Error object or message
 * @param context Error context
 * @param options Error reporting options
 */
export const reportError = (
  error: Error | string,
  context: ErrorContext = {},
  options: ErrorReportOptions = {}
): void => {
  const opts = { ...defaultOptions, ...options };
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;
  
  // Create a structured error with context
  const structuredError = {
    message: errorMessage,
    originalError: errorObject,
    stack: errorObject.stack,
    context,
    timestamp: new Date().toISOString(),
    severity: opts.severity
  };
  
  // Log to console
  if (opts.log) {
    switch (opts.severity) {
      case ErrorSeverity.INFO:
        console.info('Error:', structuredError);
        break;
      case ErrorSeverity.WARNING:
        console.warn('Warning:', structuredError);
        break;
      case ErrorSeverity.CRITICAL:
        console.error('Critical Error:', structuredError);
        break;
      default:
        console.error('Error:', structuredError);
        break;
    }
  }
  
  // Show toast notification
  if (opts.notify) {
    const contextInfo = context.action ? ` while ${context.action}` : '';
    const componentInfo = context.component ? ` in ${context.component}` : '';
    const notificationMessage = `${errorMessage}${contextInfo}${componentInfo}`;
    
    switch (opts.severity) {
      case ErrorSeverity.INFO:
        toast.info(notificationMessage);
        break;
      case ErrorSeverity.WARNING:
        toast.warning(notificationMessage);
        break;
      case ErrorSeverity.CRITICAL:
        toast.error(notificationMessage, { 
          duration: 6000,
          important: true 
        });
        break;
      default:
        toast.error(notificationMessage);
        break;
    }
  }
  
  // Report to error tracking service
  if (opts.report) {
    // Implement integration with error tracking service here
    // For example: Sentry, LogRocket, etc.
    try {
      // window.errorTrackingService?.captureException(structuredError);
      // This is just a placeholder for actual implementation
    } catch (reportingError) {
      console.error('Failed to report error to tracking service:', reportingError);
    }
  }
};

/**
 * Create an error reporter scoped to a specific component
 * @param componentName The name of the component
 * @returns Error reporter functions
 */
export const createErrorReporter = (componentName: string) => {
  return {
    reportError: (
      error: Error | string,
      context: Omit<ErrorContext, 'component'> = {},
      options: ErrorReportOptions = {}
    ) => reportError(
      error,
      { ...context, component: componentName },
      options
    ),
    
    reportWarning: (
      error: Error | string,
      context: Omit<ErrorContext, 'component'> = {},
      options: ErrorReportOptions = {}
    ) => reportError(
      error,
      { ...context, component: componentName },
      { ...options, severity: ErrorSeverity.WARNING }
    ),
    
    reportInfo: (
      error: Error | string,
      context: Omit<ErrorContext, 'component'> = {},
      options: ErrorReportOptions = {}
    ) => reportError(
      error,
      { ...context, component: componentName },
      { ...options, severity: ErrorSeverity.INFO }
    ),
    
    reportCritical: (
      error: Error | string,
      context: Omit<ErrorContext, 'component'> = {},
      options: ErrorReportOptions = {}
    ) => reportError(
      error,
      { ...context, component: componentName },
      { ...options, severity: ErrorSeverity.CRITICAL }
    )
  };
};

// Additional utility for handling async operation errors
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  options: ErrorReportOptions = {}
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    reportError(
      error instanceof Error ? error : new Error(String(error)),
      context, 
      options
    );
    return null;
  }
};
