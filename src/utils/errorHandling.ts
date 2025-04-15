
/**
 * Error handling utility functions
 * Enhanced with proper error sanitization and production-safe error handling
 */

import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

// Define error context type
interface ErrorContext {
  component?: string;
  operation?: string;
  context?: Record<string, any>;
}

// Define different error severity levels
type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';

/**
 * Sanitize error message to avoid leaking sensitive information
 * @param error Raw error object
 * @param includeDetails Whether to include technical details (false in production)
 * @returns Sanitized error message
 */
const sanitizeErrorMessage = (error: unknown, includeDetails = false): string => {
  // Get a basic error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'An unknown error occurred';
  
  // In production or when details shouldn't be included, use generic messages
  if (!includeDetails || process.env.NODE_ENV === 'production') {
    // Map specific error patterns to user-friendly messages
    if (errorMessage.includes('JWT') || errorMessage.includes('token') || 
        errorMessage.includes('auth') || errorMessage.includes('login')) {
      return 'Authentication error. Please sign in again.';
    }
    
    if (errorMessage.includes('permission') || errorMessage.includes('not allowed') || 
        errorMessage.includes('forbidden') || errorMessage.includes('unauthorized')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return 'The requested resource was not found.';
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'The operation timed out. Please try again.';
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return 'Usage limit reached. Please try again later.';
    }
    
    // Default generic error message
    return 'An error occurred. Please try again.';
  }
  
  // For development or when details are needed, provide a sanitized version of the actual message
  return errorMessage
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
    .replace(/[^\w\s.,;:!?()\[\]{}-]/g, '') // Remove special characters that could be used for XSS
    .substring(0, 200); // Limit length
};

/**
 * Handle errors consistently throughout the application
 * with improved security and error sanitization
 * @param error The error to handle
 * @param severity The severity level of the error
 * @param context Additional context about the error
 */
export const handleError = (
  error: unknown, 
  severity: ErrorSeverity = 'error',
  context: ErrorContext = {}
): void => {
  // Determine if we should show technical details (only in development)
  const includeDetails = process.env.NODE_ENV !== 'production';
  
  // Sanitize the error message
  const sanitizedMessage = sanitizeErrorMessage(error, includeDetails);
  
  // Log error with context but without exposing sensitive data
  if (severity === 'critical' || severity === 'error') {
    // Only log errors and critical issues, not warnings or info
    logger.error('Error occurred', { 
      message: sanitizedMessage,
      severity,
      ...context
    });
  }
  
  // Show appropriate toast to user based on severity
  switch (severity) {
    case 'critical':
      toast.error(sanitizedMessage, { duration: 5000 });
      break;
    case 'error':
      toast.error(sanitizedMessage);
      break;
    case 'warning':
      toast.warning(sanitizedMessage);
      break;
    case 'info':
      toast.info(sanitizedMessage);
      break;
  }
  
  // Report to error monitoring service if critical or error
  if (severity === 'critical' || severity === 'error') {
    captureError(error, `${severity}-${context.operation || 'unknown'}`, {
      context: {
        component: context.component || 'unknown',
        operation: context.operation || 'unknown',
        ...context
      },
      level: severity === 'critical' ? 'fatal' : 'error'
    });
  }
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
  return sanitizeErrorMessage(error, process.env.NODE_ENV !== 'production') || fallbackMessage;
};
