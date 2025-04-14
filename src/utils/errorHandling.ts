
/**
 * Error handling utility functions
 */

import { toast } from 'sonner';

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
  
  // Log to console with context
  console.error('Error:', errorMessage, context, error);
  
  // Show toast notification to user
  toast.error(errorMessage);
  
  // In a production app, we would also log to an error tracking service
  // like Sentry here
};
