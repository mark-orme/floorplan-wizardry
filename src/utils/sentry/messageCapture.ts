
/**
 * Sentry message reporting functionality
 * @module utils/sentry/messageCapture
 */
import * as Sentry from '@sentry/react';
import logger from '../logger';
import { isSentryInitialized } from './core';
import { ErrorCaptureOptions, getSentryLevel } from './types';

/**
 * Report a message to Sentry (for non-error issues)
 * 
 * @param {string} message - Message to report
 * @param {string} messageId - Unique identifier for the message
 * @param {ErrorCaptureOptions} options - Additional options for the message
 */
export function captureMessage(
  message: string,
  messageId: string,
  options: ErrorCaptureOptions = {}
): void {
  // Set default level
  const level = options.level || 'info';
  
  // Log the message
  logger.info(`Capturing message: [${messageId}] ${message}`, { level });
  
  // Report to Sentry if available
  try {
    if (isSentryInitialized()) {
      // Set additional context for the message
      if (options.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          Sentry.setTag(key, value);
        });
      }
      
      // Set additional context data
      if (options.extra) {
        Sentry.setContext('additional', options.extra);
      }
      
      // Use the map to get the proper Sentry severity level
      const sentryLevel = getSentryLevel(level);
      
      // Now pass the properly typed severity level to Sentry
      Sentry.captureMessage(`[${messageId}] ${message}`, sentryLevel);
    } else {
      // Mock Sentry capture
      console.info(`[Sentry Mock] Captured ${level} message [${messageId}]:`, message);
    }
  } catch (sentryError) {
    console.error('Failed to capture message in Sentry:', sentryError);
  }
}
