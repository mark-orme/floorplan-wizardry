
/**
 * Utility functions for Sentry error reporting
 */

// Simple mock function for Sentry messages
export const captureMessage = (message: string, options?: any) => {
  console.log(`[${options?.level || 'info'}] ${message}`, options?.extra);
};

// Update capture error to accept a proper signature with max 2 arguments
export const captureError = (error: Error | string, context?: any) => {
  const errorMessage = error instanceof Error ? error.message : error;
  console.error(`[error] ${errorMessage}`, context);
};
