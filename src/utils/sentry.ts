
/**
 * Utility functions for Sentry error reporting
 */

// Simple mock function for now - in a real implementation this would integrate with Sentry
export const captureMessage = (message: string, level: string = 'info', context?: any) => {
  console.log(`[${level}] ${message}`, context);
};

// Updated to accept proper arguments (2 max instead of 3)
export const captureError = (error: Error, context?: any) => {
  console.error(`[error] ${error.message}`, context);
};
