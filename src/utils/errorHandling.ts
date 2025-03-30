
// Create a basic error handling utility

/**
 * Error handling options
 */
interface ErrorHandlingOptions {
  /** Component name */
  component?: string;
  /** Operation being performed */
  operation?: string;
  /** Additional context information */
  context?: Record<string, any>;
  /** Whether to show toast notification */
  showToast?: boolean;
}

/**
 * Handle error with appropriate logging and reporting
 * @param {Error | unknown} error - Error to handle
 * @param {ErrorHandlingOptions} options - Error handling options
 */
export const handleError = (error: Error | unknown, options: ErrorHandlingOptions = {}): void => {
  const { component = 'unknown', operation = 'unknown', context = {}, showToast = false } = options;
  
  // Convert unknown error to Error object with sensible default message
  const errorObj = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' ? error : 'An unknown error occurred');
  
  // Log to console with context
  console.error(`[${component}/${operation}] Error:`, errorObj, context);
  
  // In a real app, we would report to monitoring service here
  
  // Show toast notification if requested
  if (showToast) {
    // Assuming toast is imported and available
    // toast.error(errorObj.message);
    console.error(`TOAST: ${errorObj.message}`);
  }
};
