
/**
 * Error handling utility functions
 */

import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';
import { Security } from '@/utils/security';

interface ErrorContext {
  component?: string;
  operation?: string;
  context?: Record<string, any>;
}

/**
 * Handle errors consistently throughout the application
 * @param error The error to handle
 * @param context Additional context about the error
 */
export const handleError = (error: unknown, context: ErrorContext = {}) => {
  // Extract error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'An unknown error occurred';
  
  // Sanitize error message to prevent XSS
  const sanitizedErrorMessage = Security.Input.sanitizeHtml(errorMessage);
  
  // Log to console with context
  console.error('Error:', errorMessage, context, error);
  
  // Show sanitized toast notification to user - hide technical details in production
  const userFacingMessage = process.env.NODE_ENV === 'production'
    ? 'An error occurred. Please try again.'
    : sanitizedErrorMessage;
    
  toast.error(userFacingMessage);
  
  // Report to Sentry with full details
  captureError(error, `error-${context.operation || 'unknown'}`, {
    context: {
      component: context.component || 'unknown',
      operation: context.operation || 'unknown',
      ...context
    },
    level: 'error'
  });
};

/**
 * Create a safe, user-friendly error message
 * @param error The error object
 * @param fallbackMessage Fallback message if error is not properly formatted
 * @returns Sanitized user-friendly error message
 */
export const createUserFriendlyErrorMessage = (
  error: unknown, 
  fallbackMessage = 'An error occurred. Please try again.'
): string => {
  // In production, use generic messages for security
  if (process.env.NODE_ENV === 'production') {
    // Allow some specific known errors to be shown to users
    if (error instanceof Error) {
      // Only show specific user-friendly errors in production
      if (error.message.includes('not found') || 
          error.message.includes('invalid credentials') ||
          error.message.includes('required field') ||
          error.message.includes('permission')) {
        return Security.Input.sanitizeHtml(error.message);
      }
    }
    return fallbackMessage;
  }
  
  // In development, show more details
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'Unknown error';
  
  return Security.Input.sanitizeHtml(errorMessage);
};
