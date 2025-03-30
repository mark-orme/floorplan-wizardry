
/**
 * Sentry error capture functionality
 * @module utils/sentry/errorCapture
 */
import * as Sentry from '@sentry/react';
import logger from '../logger';
import { isSentryInitialized } from './core';
import { ErrorCaptureOptions } from './types';

/**
 * Capture an error for Sentry reporting
 * Fall back to console logging when Sentry is not available
 * 
 * @param {Error} error - The error to capture
 * @param {string} errorId - Unique identifier for the error
 * @param {ErrorCaptureOptions} options - Additional options for the error report
 */
export function captureError(
  error: Error | unknown, 
  errorId: string, 
  options: ErrorCaptureOptions = {}
): void {
  // Convert unknown error to proper Error object
  const errorObj = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' ? error : 'Unknown error');
  
  // Get the current environment
  const isProd = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  
  // Add error ID to the error message
  errorObj.message = `[${errorId}] ${errorObj.message}`;
  
  // Log the error to console (with different levels in dev/prod)
  if (isProd) {
    console.error(`[${errorId}]`, errorObj.message);
  } else {
    console.error(`[${errorId}]`, errorObj, options);
  }
  
  // Skip further Sentry reporting in test environment
  if (isTest) return;
  
  // Log using application logger
  logger.error(`Capturing error: ${errorObj.message}`, {
    errorId,
    stack: errorObj.stack,
    level: options.level || 'error',
    tags: options.tags
  });
  
  // Report to Sentry if available
  try {
    if (isSentryInitialized()) {
      // Set additional context for the error
      if (options.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          Sentry.setTag(key, value);
        });
      }
      
      // Set additional context data
      if (options.extra) {
        Sentry.setContext('additional', options.extra);
      }
      
      // Set user information if provided
      if (options.user) {
        Sentry.setUser(options.user);
      }
      
      // Capture the error with appropriate level
      const eventId = Sentry.captureException(errorObj);
      
      // Log the Sentry event ID
      logger.info(`Sentry event captured: ${eventId}`, { errorId });
      
      // Show report dialog if requested
      if (options.showReportDialog) {
        Sentry.showReportDialog({ eventId });
      }
    } else {
      // Sentry not initialized, log as info
      logger.info(`Sentry not initialized. Would have reported: [${errorId}] ${errorObj.message}`);
    }
  } catch (sentryError) {
    // Failure in Sentry reporting should not break the application
    console.error('Failed to capture error in Sentry:', sentryError);
    logger.error('Failed to capture error in Sentry', { 
      originalError: errorObj.message,
      sentryError: sentryError instanceof Error ? sentryError.message : 'Unknown Sentry error'
    });
  }
}
