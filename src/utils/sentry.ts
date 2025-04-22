
/**
 * Utility functions for Sentry error reporting
 */

// Simple mock function for Sentry messages
export const captureMessage = (message: string, level: string = 'info', context?: any) => {
  console.log(`[${level}] ${message}`, context);
};

// Update capture error to accept a proper signature with max 2 arguments
export const captureError = (error: Error, context?: any) => {
  console.error(`[error] ${error.message}`, context);
};
