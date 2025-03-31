
/**
 * Simplified Sentry utility functions
 * @module utils/sentry
 */

// Import these directly to avoid circular dependencies
import type { ErrorCaptureOptions } from './sentry/types';

// Re-export the types
export type { ErrorCaptureOptions };

/**
 * Capture a message for Sentry reporting
 * Simplified version with consistent parameter structure
 * 
 * @param {string} message - The message to capture
 * @param {string} [messageId] - Optional unique identifier for the message
 * @param {ErrorCaptureOptions} [options] - Optional configuration options
 */
export function captureMessage(message: string, messageId?: string, options?: ErrorCaptureOptions): void {
  if (messageId) {
    console.log(`[${messageId}] ${message}`);
  } else {
    console.log(message);
  }
  
  // Log any options for debugging purposes
  if (options && Object.keys(options).length > 0) {
    console.debug('Message options:', options);
  }
  
  // Actual Sentry implementation would go here
}

/**
 * Capture an error for Sentry reporting
 * Simplified version with consistent parameter structure
 * 
 * @param {Error} error - The error to capture
 * @param {string} [errorId] - Optional unique identifier for the error
 * @param {ErrorCaptureOptions} [options] - Optional configuration options
 */
export function captureError(error: Error, errorId?: string, options?: ErrorCaptureOptions): void {
  if (errorId) {
    console.error(`[${errorId}] ${error.message}`);
  } else {
    console.error(error.message);
  }
  
  // Log stack trace and any options for debugging purposes
  console.debug(error.stack);
  if (options && Object.keys(options).length > 0) {
    console.debug('Error options:', options);
  }
  
  // Actual Sentry implementation would go here
}

/**
 * Start a performance transaction for monitoring and timing
 * Simplified version for performance monitoring
 * 
 * @param {string} name - Name of the transaction
 * @param {Record<string, any>} [options] - Optional configuration options
 * @returns {Object} Transaction object with finish method
 */
export function startPerformanceTransaction(name: string, options?: Record<string, any>) {
  const startTime = performance.now();
  console.log(`Starting transaction: ${name}`);
  
  if (options) {
    console.debug('Transaction options:', options);
  }
  
  return {
    finish: (status?: string) => {
      const duration = performance.now() - startTime;
      console.log(`Finished transaction: ${name} in ${duration.toFixed(2)}ms${status ? ` (${status})` : ''}`);
      return duration;
    }
  };
}

/**
 * Check if Sentry is initialized
 * 
 * @returns {boolean} Whether Sentry is initialized
 */
export function isSentryInitialized(): boolean {
  // For this simplified implementation, always return false
  return false;
}
