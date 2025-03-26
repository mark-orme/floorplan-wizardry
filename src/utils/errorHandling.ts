
/**
 * Error handling utilities module
 * Contains functions for consistent error handling across the application
 * @module errorHandling
 */
import { toast } from "sonner";
import { captureError } from "./sentryUtils";

/**
 * Type definition for error context
 */
export interface ErrorContext {
  /** Component or module where the error occurred */
  component: string;
  /** Specific operation that was being performed */
  operation: string;
  /** Additional data related to the error */
  data?: Record<string, any>;
}

/**
 * Options for handleError function
 */
export interface HandleErrorOptions {
  /** Show a user-facing toast notification */
  showToast: boolean;
  /** Send error to monitoring service */
  reportToSentry: boolean;
  /** Error severity level */
  level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  /** Extra data to include with the error report */
  extra?: Record<string, any>;
}

/**
 * Default options for error handling
 */
const defaultErrorOptions: HandleErrorOptions = {
  showToast: true,
  reportToSentry: true,
  level: 'error'
};

/**
 * Handle errors consistently across the application
 * @param {unknown} error - The error that occurred
 * @param {ErrorContext} context - Error context information
 * @param {HandleErrorOptions} options - Error handling options
 */
export const handleError = (
  error: unknown,
  context: ErrorContext,
  options: Partial<HandleErrorOptions> = {}
): void => {
  // Merge with default options
  const mergedOptions = { ...defaultErrorOptions, ...options };
  
  // Determine error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context.component} (${context.operation}):`, error);
  }
  
  // Show toast notification if enabled
  if (mergedOptions.showToast) {
    toast.error(`Error: ${errorMessage}`, {
      id: `${context.component}-${context.operation}-error`,
      duration: 5000
    });
  }
  
  // Report to error monitoring if enabled
  if (mergedOptions.reportToSentry) {
    captureError(error, `${context.component}-${context.operation}`, {
      level: mergedOptions.level,
      tags: {
        component: context.component,
        operation: context.operation
      },
      extra: {
        ...context.data,
        ...mergedOptions.extra
      }
    });
  }
};

/**
 * Wrap an async function with error handling
 * @param {Function} fn - The async function to wrap
 * @param {ErrorContext} context - Error context information
 * @param {HandleErrorOptions} options - Error handling options
 * @returns {Function} Wrapped function with error handling
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: ErrorContext,
  options: Partial<HandleErrorOptions> = {}
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };
};
