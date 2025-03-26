
/**
 * Sentry error reporting utilities
 * Provides functions for capturing and reporting errors to Sentry
 * @module sentryUtils
 */

/**
 * Error capture configuration
 * @typedef {Object} ErrorCaptureConfig
 * @property {Object} [tags] - Tags to attach to the error
 * @property {Object} [extra] - Extra context data to attach
 * @property {string} [level] - Severity level
 * @property {boolean} [handled] - Whether the error was handled
 */
interface ErrorCaptureConfig {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  handled?: boolean;
}

/**
 * Capture an error and send it to Sentry
 * If Sentry is not initialized, logs to console instead
 * 
 * @param {Error|unknown} error - The error to capture
 * @param {string} [context] - Context description for the error
 * @param {ErrorCaptureConfig} [config] - Additional configuration
 */
export const captureError = (
  error: Error | unknown,
  context?: string,
  config?: ErrorCaptureConfig
): void => {
  // Format error for logging
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  // Create a standardized error object
  const errorObj = {
    message: errorMessage,
    context: context || 'unknown',
    timestamp: new Date().toISOString(),
    ...config
  };
  
  // In development mode, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `[${errorObj.context}] Error:`, 
      errorMessage, 
      error instanceof Error ? error.stack : '',
      config
    );
  }
  
  // If Sentry is available, report the error
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      const Sentry = (window as any).Sentry;
      
      // Set scope with additional context
      Sentry.withScope((scope: any) => {
        // Add tags
        if (config?.tags) {
          Object.entries(config.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        
        // Add extra context
        if (config?.extra) {
          Object.entries(config.extra).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
        }
        
        // Set level if specified
        if (config?.level) {
          scope.setLevel(config.level);
        }
        
        // Add context
        if (context) {
          scope.setContext('error_context', { name: context });
        }
        
        // Capture the error
        if (error instanceof Error) {
          Sentry.captureException(error);
        } else {
          Sentry.captureMessage(errorMessage);
        }
      });
    } catch (sentryError) {
      // Fallback to console if Sentry capture fails
      console.error('Failed to report to Sentry:', sentryError);
    }
  }
};

/**
 * Set user context for Sentry
 * Associates errors with a specific user
 * 
 * @param {Object} user - User information
 * @param {string} [user.id] - User ID
 * @param {string} [user.email] - User email
 * @param {string} [user.username] - Username
 */
export const setUserContext = (user: {
  id?: string;
  email?: string;
  username?: string;
}): void => {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      (window as any).Sentry.setUser(user);
    } catch (error) {
      console.error('Failed to set Sentry user context:', error);
    }
  }
};

/**
 * Clear all Sentry contexts
 * Useful when user logs out
 */
export const clearErrorContext = (): void => {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      (window as any).Sentry.configureScope((scope: any) => scope.clear());
    } catch (error) {
      console.error('Failed to clear Sentry context:', error);
    }
  }
};
