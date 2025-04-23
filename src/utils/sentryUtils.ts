
/**
 * Enhanced Sentry utility functions for error reporting
 * Provides consistent error monitoring with context across the application
 */
import * as Sentry from '@sentry/react';

// Define types for error reporting
export interface ErrorReportOptions {
  tags?: Record<string, string>;
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  extra?: Record<string, any>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}

/**
 * Capture an error with Sentry, with detailed context
 * @param error The error object or string message
 * @param options Additional options for error reporting
 */
export const captureError = (error: Error | string, options?: ErrorReportOptions): void => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  console.error('Error captured:', errorObj);
  
  try {
    Sentry.withScope((scope) => {
      // Set error level
      if (options?.level) {
        scope.setLevel(options.level);
      }
      
      // Set additional context tags
      if (options?.tags) {
        scope.setTags(options.tags);
      }
      
      // Set additional context data
      if (options?.context) {
        scope.setContext('errorContext', options.context);
      }
      
      // Set additional extra data
      if (options?.extra) {
        scope.setExtras(options.extra);
      }
      
      // Set user information
      if (options?.user) {
        scope.setUser(options.user);
      }
      
      // Capture the error
      Sentry.captureException(errorObj);
    });
  } catch (sentryError) {
    // Fallback if Sentry fails
    console.error('Failed to report error to Sentry:', sentryError);
    console.error('Original error:', errorObj);
  }
};

/**
 * Capture a diagnostic message
 * @param message Message to capture
 * @param level Log level
 * @param tags Additional tags
 */
export const captureMessage = (
  message: string, 
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  tags?: Record<string, string>
): void => {
  console.log(`[${level}] ${message}`);
  
  try {
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      if (tags) {
        scope.setTags(tags);
      }
      Sentry.captureMessage(message);
    });
  } catch (sentryError) {
    console.error('Failed to send message to Sentry:', sentryError);
  }
};

/**
 * Create a monitored version of a function that automatically reports errors
 * @param fn Function to monitor
 * @param errorContext Context name for error reporting
 * @returns Monitored function
 */
export function withErrorMonitoring<T extends (...args: any[]) => any>(
  fn: T, 
  errorContext: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args);
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        tags: { context: errorContext },
        context: { arguments: JSON.stringify(args) }
      });
      throw error;
    }
  };
}

/**
 * Monitor a React component for errors
 * @param component Component to monitor
 * @param componentName Component name for error reporting
 * @returns Monitored component
 */
export const withComponentErrorMonitoring = (
  component: React.ComponentType<any>,
  componentName: string
): React.ComponentType<any> => {
  return Sentry.withErrorBoundary(component, {
    fallback: ({ error, componentStack, resetError }) => (
      <div className="error-boundary p-4 bg-red-50 text-red-700 rounded-md">
        <h3 className="font-bold">Something went wrong in {componentName}</h3>
        <p>{error.message}</p>
        <button
          className="px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={resetError}
        >
          Try again
        </button>
      </div>
    )
  });
};

export default {
  captureError,
  captureMessage,
  withErrorMonitoring,
  withComponentErrorMonitoring
};
