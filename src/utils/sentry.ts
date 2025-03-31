
/**
 * Simplified Sentry utility functions
 * @module utils/sentry
 */

// Import these directly to avoid circular dependencies
export type { ErrorCaptureOptions } from './sentry/types';

/**
 * Capture a message for Sentry reporting
 * Simplified version with fewer parameters
 * 
 * @param {string} message - The message to capture
 * @param {string} [messageId] - Optional unique identifier for the message
 */
export function captureMessage(message: string, messageId?: string): void {
  if (messageId) {
    console.log(`[${messageId}] ${message}`);
  } else {
    console.log(message);
  }
  // Actual Sentry implementation would go here
}

/**
 * Capture an error for Sentry reporting
 * Simplified version with fewer parameters
 * 
 * @param {Error} error - The error to capture
 * @param {string} [errorId] - Optional unique identifier for the error
 */
export function captureError(error: Error, errorId?: string): void {
  if (errorId) {
    console.error(`[${errorId}] ${error.message}`);
  } else {
    console.error(error.message);
  }
  // Actual Sentry implementation would go here
}
