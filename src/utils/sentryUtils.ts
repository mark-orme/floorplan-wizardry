
/**
 * Sentry utility functions for consistent error tracking across the application
 * @module sentryUtils
 */
import * as Sentry from "@sentry/react";

/**
 * Interface for error capturing options
 * @interface CaptureErrorOptions
 */
interface CaptureErrorOptions {
  /** Tags to attach to the error */
  tags?: Record<string, string>;
  /** Additional context data */
  extra?: Record<string, any>;
  /** User information */
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  /** Error level */
  level?: Sentry.SeverityLevel;
}

/**
 * Capture an error with Sentry
 * 
 * @param {unknown} error - The error object to capture
 * @param {string} context - Context description of where the error occurred
 * @param {CaptureErrorOptions} options - Additional options for error tracking
 */
export const captureError = (
  error: unknown, 
  context: string,
  options: CaptureErrorOptions = {}
): void => {
  const { tags, extra, user, level = "error" } = options;
  
  // Set scope with additional information
  Sentry.withScope((scope) => {
    // Add context as tag
    scope.setTag("context", context);
    
    // Add any additional tags
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    // Add extra context data
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    // Add user context if available
    if (user) {
      scope.setUser(user);
    }
    
    // Set the severity level
    scope.setLevel(level);
    
    // Capture the exception
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      // If it's not an Error object, create one to capture the stack trace
      const normalizedError = new Error(typeof error === 'string' ? error : 'Unknown error');
      // Add the original error as context
      scope.setExtra('originalError', error);
      Sentry.captureException(normalizedError);
    }
  });
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
};

/**
 * Create a transaction for performance monitoring
 * 
 * @param {string} name - Transaction name
 * @param {string} op - Operation type
 * @returns {Sentry.Transaction | undefined} Transaction object
 */
export const startTransaction = (
  name: string,
  op: string
): Sentry.Transaction | undefined => {
  try {
    return Sentry.startTransaction({
      name,
      op
    });
  } catch (error) {
    console.error('Failed to start Sentry transaction:', error);
    return undefined;
  }
};

/**
 * Set user information in Sentry
 * 
 * @param {Object} user - User information
 */
export const setUser = (user: {
  id?: string;
  email?: string;
  username?: string;
} | null): void => {
  if (user) {
    Sentry.setUser(user);
  } else {
    Sentry.setUser(null);
  }
};

