
/**
 * Simplified Sentry utility functions
 * @module utils/sentryUtils
 */

import { captureError as sentryCapture } from './sentry';
import { captureMessage as sentryMessage } from './sentry/messageCapture';
import { startPerformanceTransaction as sentryPerformance } from './sentry/performance';
import { isSentryInitialized } from './sentry/core';
import { monitorErrorRate } from './errorMonitoring';
import type { CaptureErrorOptions, CaptureMessageOptions } from './sentry/types';

// Re-export the types
export type { CaptureErrorOptions, CaptureMessageOptions };
export { isSentryInitialized };

/**
 * Capture a message for Sentry reporting
 * Enhanced version with error monitoring integration
 * 
 * @param {string} message - The message to capture
 * @param {string} [messageId] - Optional unique identifier for the message
 * @param {CaptureMessageOptions} [options] - Optional configuration options
 */
export function captureMessage(message: string, messageId?: string, options?: CaptureMessageOptions): void {
  // Track for system monitoring if messageId provided
  if (messageId) {
    const context = options?.context?.component || 'unknown';
    monitorErrorRate(`message:${messageId}`, context);
  }
  
  // Forward to actual Sentry implementation
  sentryMessage(message, messageId || 'generic', options || {});
}

/**
 * Capture an error for Sentry reporting
 * Enhanced version with error monitoring integration
 * 
 * @param {Error | unknown} error - The error to capture
 * @param {string} [errorId] - Optional unique identifier for the error
 * @param {CaptureErrorOptions} [options] - Optional configuration options
 */
export function captureError(error: Error | unknown, errorId?: string, options?: CaptureErrorOptions): void {
  // Track for system monitoring if errorId provided
  if (errorId) {
    const context = options?.context?.component || 'unknown';
    monitorErrorRate(`error:${errorId}`, context);
  }
  
  // Convert unknown errors to Error objects for proper handling
  const normalizedError = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' 
        ? error 
        : JSON.stringify(error));
  
  // Forward to actual Sentry implementation
  sentryCapture(normalizedError, errorId, options);
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
  return sentryPerformance(name, options);
}
