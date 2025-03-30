
/**
 * Utility functions for error capture and reporting to Sentry
 * @module utils/sentryUtils
 */
import * as Sentry from '@sentry/react';
import logger from './logger';

/**
 * Error capture options
 */
interface ErrorCaptureOptions {
  /** Error severity level */
  level?: "error" | "warning" | "info";
  /** Additional tags for categorization */
  tags?: Record<string, string>;
  /** Additional context data */
  extra?: Record<string, any>;
  /** User information */
  user?: {
    id?: string;
    email?: string;
    username?: string;
    ip_address?: string;
  };
  /** Whether to show the report dialog to the user */
  showReportDialog?: boolean;
  /** Additional fingerprinting information */
  fingerprint?: string[];
}

/**
 * Check if Sentry is properly initialized
 * @returns {boolean} Whether Sentry is initialized
 */
const isSentryInitialized = (): boolean => {
  try {
    return Sentry.getCurrentHub().getClient() !== undefined;
  } catch (e) {
    return false;
  }
};

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
      
      // Capture the message
      Sentry.captureMessage(`[${messageId}] ${message}`, level as Sentry.SeverityLevel);
    } else {
      // Mock Sentry capture
      console.info(`[Sentry Mock] Captured ${level} message [${messageId}]:`, message);
    }
  } catch (sentryError) {
    console.error('Failed to capture message in Sentry:', sentryError);
  }
}

/**
 * Start performance monitoring for a specific operation
 * 
 * @param {string} name - Name of the operation
 * @param {Record<string, string>} [tags] - Additional tags for the transaction
 * @returns {Object} Transaction object with finish method
 */
export function startPerformanceTransaction(name: string, tags?: Record<string, string>) {
  // Create a timestamp for fallback timing
  const startTime = performance.now();
  let transaction: Sentry.Transaction | null = null;
  
  try {
    if (isSentryInitialized()) {
      transaction = Sentry.startTransaction({ name });
      
      // Add tags if provided
      if (tags && transaction) {
        Object.entries(tags).forEach(([key, value]) => {
          transaction?.setTag(key, value);
        });
      }
    }
  } catch (e) {
    console.error('Failed to start Sentry transaction:', e);
  }
  
  return {
    finish: (status?: string) => {
      try {
        if (transaction) {
          // Finish the Sentry transaction
          transaction.finish(status);
        } else {
          // Log fallback timing
          const duration = performance.now() - startTime;
          logger.debug(`Operation "${name}" took ${duration.toFixed(2)}ms`, { tags });
        }
      } catch (e) {
        console.error('Failed to finish Sentry transaction:', e);
      }
    }
  };
}
