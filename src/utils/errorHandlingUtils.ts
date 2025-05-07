
import { toast } from 'sonner';
import { captureMessage, captureError } from '@/utils/sentryUtils';

export interface ErrorHandlingOptions {
  context?: string;
  tags?: Record<string, string>;
  silent?: boolean;
  level?: 'error' | 'warning' | 'info';
}

/**
 * Handle API errors with proper logging and user feedback
 */
export const handleApiError = (
  error: unknown,
  message: string = 'An error occurred',
  options: ErrorHandlingOptions = {}
) => {
  // Extract error details
  const errorMessage = error instanceof Error ? error.message : String(error);
  const { context = 'api', silent = false, level = 'error', tags = {} } = options;
  
  // Log to console
  console.error(`API Error [${context}]:`, error);
  
  // Capture for monitoring
  captureError(error instanceof Error ? error : new Error(errorMessage), {
    tags: { 
      context,
      ...tags
    },
    level: level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info',
  });
  
  // Show toast notification unless silent
  if (!silent) {
    toast.error(message);
  }
  
  // Return formatted error for handling
  return {
    message: errorMessage,
    context,
    originalError: error
  };
};

/**
 * Convert unknown error to proper Error object
 */
export const asError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  
  return new Error(typeof error === 'string' ? error : 'Unknown error occurred');
};

/**
 * Safely handle a caught exception with proper logging and notification
 */
export const handleCaughtError = (
  error: unknown,
  context: string,
  showNotification: boolean = true
): Error => {
  const formattedError = asError(error);
  
  console.error(`Error in ${context}:`, formattedError);
  
  captureError(formattedError, {
    tags: { context },
    level: 'error',
  });
  
  if (showNotification) {
    toast.error(`An error occurred: ${formattedError.message}`);
  }
  
  return formattedError;
};

/**
 * Create a context-specific error handler
 */
export function createErrorHandler(defaultContext: string) {
  return function(error: unknown, message?: string, options: ErrorHandlingOptions = {}) {
    return handleApiError(error, message, { 
      ...options,
      context: options.context || defaultContext
    });
  };
}
