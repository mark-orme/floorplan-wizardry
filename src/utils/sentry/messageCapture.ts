
/**
 * Sentry message capture functionality
 * @module utils/sentry/messageCapture
 */
import * as Sentry from '@sentry/react';
import logger from '../logger';
import { isSentryInitialized } from './core';
import { CaptureMessageOptions } from './types';

/**
 * Capture a message for Sentry reporting
 * 
 * @param {string} message - The message to capture
 * @param {string} messageId - Unique identifier for the message
 * @param {CaptureMessageOptions} options - Additional options for the message
 */
export function captureMessage(
  message: string,
  messageId: string,
  options: CaptureMessageOptions = {}
): void {
  // Get the current environment
  const isProd = import.meta.env.PROD;
  const isTest = import.meta.env.MODE === 'test';
  
  // Add message ID to the message
  const fullMessage = `[${messageId}] ${message}`;
  
  // Log the message to console
  console.log(fullMessage);
  
  // Skip further Sentry reporting in test environment
  if (isTest) return;
  
  // Log using application logger
  logger.info(`Capturing message: ${fullMessage}`, {
    messageId,
    level: options.level || 'info',
    tags: options.tags
  });
  
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
      
      // Set user information if provided
      if (options.user) {
        Sentry.setUser(options.user);
      }
      
      // Capture the message with appropriate level
      const level = options.level || 'info';
      const eventId = Sentry.captureMessage(fullMessage, level as Sentry.SeverityLevel);
      
      // Log the Sentry event ID
      logger.debug(`Sentry event captured: ${eventId}`, { messageId });
    } else {
      // Sentry not initialized, log as debug
      logger.debug(`Sentry not initialized. Would have reported: ${fullMessage}`);
    }
  } catch (sentryError) {
    // Failure in Sentry reporting should not break the application
    console.error('Failed to capture message in Sentry:', sentryError);
  }
}
