
/**
 * Simplified Sentry utility functions
 * @module utils/sentryUtils
 */

import { captureError as sentryCapture } from './sentry';
import { captureMessage as sentryMessage } from './sentry/messageCapture';
import { startPerformanceTransaction as sentryPerformance } from './sentry/performance';
import { isSentryInitialized } from './sentry/core';
import { monitorErrorRate } from './errorMonitoring';
import type { ErrorCaptureOptions } from './sentry/types';

// Re-export the types
export type { ErrorCaptureOptions };
export { isSentryInitialized };

/**
 * Capture a message for Sentry reporting
 * Enhanced version with error monitoring integration
 * 
 * @param {string} message - The message to capture
 * @param {string} [messageId] - Optional unique identifier for the message
 * @param {ErrorCaptureOptions} [options] - Optional configuration options
 */
export function captureMessage(message: string, messageId?: string, options?: ErrorCaptureOptions): void {
  // Track for system monitoring if messageId provided
  if (messageId) {
    const context = options?.context?.component || 'unknown';
    monitorErrorRate(`message:${messageId}`, context);
  }
  
  // Forward to actual Sentry implementation
  sentryMessage(message, messageId, options);
}

/**
 * Capture an error for Sentry reporting
 * Enhanced version with error monitoring integration
 * 
 * @param {Error} error - The error to capture
 * @param {string} [errorId] - Optional unique identifier for the error
 * @param {ErrorCaptureOptions} [options] - Optional configuration options
 */
export function captureError(error: Error | unknown, errorId?: string, options?: ErrorCaptureOptions): void {
  // Track for system monitoring if errorId provided
  if (errorId) {
    const context = options?.context?.component || 'unknown';
    monitorErrorRate(`error:${errorId}`, context);
  }
  
  // Forward to actual Sentry implementation
  sentryCapture(error, errorId, options);
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
