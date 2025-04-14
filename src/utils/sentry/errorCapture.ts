
import * as Sentry from '@sentry/react';
import logger from '../logger';
import { isSentryInitialized } from './core';
import { ErrorCaptureOptions } from './types';

/**
 * Enhanced error capture with improved security and context
 */
export function captureError(
  error: Error | unknown, 
  errorId: string, 
  options: ErrorCaptureOptions = {}
): void {
  // Sanitize and convert error to standard Error object
  const sanitizedError = error instanceof Error 
    ? error 
    : new Error(
        typeof error === 'string' 
          ? error 
          : error instanceof Object 
            ? JSON.stringify(error) 
            : 'Unknown error'
      );
  
  // Scrub potentially sensitive information
  const scrubbedMessage = sanitizeErrorMessage(sanitizedError.message);
  sanitizedError.message = `[${errorId}] ${scrubbedMessage}`;

  // Log error with different levels based on environment
  const logError = process.env.NODE_ENV === 'production' 
    ? logger.error 
    : console.error;

  logError(`Error Capture [${errorId}]:`, {
    message: sanitizedError.message,
    stack: sanitizedError.stack,
    context: options.extra
  });

  // Skip Sentry reporting in test environments
  if (process.env.NODE_ENV === 'test') return;

  try {
    if (isSentryInitialized()) {
      // Add security-focused tags
      const securityTags = {
        ...options.tags,
        errorId,
        severity: determineSeverity(sanitizedError),
        environment: process.env.NODE_ENV
      };

      // Set Sentry context with scrubbed information
      Object.entries(securityTags).forEach(([key, value]) => {
        Sentry.setTag(key, String(value));
      });

      // Capture with additional context
      const eventId = Sentry.captureException(sanitizedError, {
        tags: securityTags,
        extra: {
          ...options.extra,
          errorSource: errorId
        }
      });

      logger.info(`Sentry event captured: ${eventId}`, { errorId });

      // Optionally show report dialog in production
      if (options.showReportDialog && process.env.NODE_ENV === 'production') {
        Sentry.showReportDialog({ eventId });
      }
    }
  } catch (sentryError) {
    console.error('Sentry reporting failed:', sentryError);
  }
}

/**
 * Sanitize error messages to remove potentially sensitive information
 */
function sanitizeErrorMessage(message: string): string {
  // Remove email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  message = message.replace(emailRegex, '[EMAIL REDACTED]');

  // Remove potential secret/token patterns
  const secretRegex = /(secret|token|key|password)[\s:=]+\S+/gi;
  message = message.replace(secretRegex, '$1: [REDACTED]');

  return message;
}

/**
 * Determine error severity based on error characteristics
 */
function determineSeverity(error: Error): 'low' | 'medium' | 'high' {
  const message = error.message.toLowerCase();
  
  if (message.includes('unauthorized') || message.includes('authentication')) {
    return 'high';
  }
  
  if (message.includes('network') || message.includes('connection')) {
    return 'medium';
  }
  
  return 'low';
}

