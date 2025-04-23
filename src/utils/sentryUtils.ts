/**
 * Enhanced Sentry utility functions for error reporting
 * Provides consistent error monitoring with context across the application
 */
import * as Sentry from '@sentry/react';
import React from 'react';
import { ErrorFallback } from './sentry/ErrorFallback';

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

type SentryMessageOptions = {
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
};

export function captureMessage(message: string, options: SentryMessageOptions): void;
export function captureMessage(
  message: string, 
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug',
  tags?: Record<string, string>
): void;
export function captureMessage(
  message: string,
  levelOrOptions?: SentryMessageOptions | 'fatal' | 'error' | 'warning' | 'info' | 'debug',
  tags?: Record<string, string>
): void {
  console.log(`[${typeof levelOrOptions === 'object' ? levelOrOptions.level || 'info' : levelOrOptions || 'info'}] ${message}`);
  
  try {
    Sentry.withScope((scope) => {
      if (typeof levelOrOptions === 'object') {
        // Handle options object
        if (levelOrOptions.level) {
          scope.setLevel(levelOrOptions.level);
        }
        if (levelOrOptions.tags) {
          scope.setTags(levelOrOptions.tags);
        }
        if (levelOrOptions.extra) {
          scope.setExtras(levelOrOptions.extra);
        }
      } else {
        // Handle level + tags
        scope.setLevel(levelOrOptions || 'info');
        if (tags) {
          scope.setTags(tags);
        }
      }
      Sentry.captureMessage(message);
    });
  } catch (sentryError) {
    console.error('Failed to send message to Sentry:', sentryError);
  }
}

/**
 * Capture an error with Sentry, with detailed context
 */
export function captureError(error: Error | string, options?: ErrorReportOptions): void {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  console.error('Error captured:', errorObj);
  
  try {
    Sentry.withScope((scope) => {
      if (options?.level) {
        scope.setLevel(options.level);
      }
      
      if (options?.tags) {
        scope.setTags(options.tags);
      }
      
      if (options?.context) {
        scope.setContext('errorContext', options.context);
      }
      
      if (options?.extra) {
        scope.setExtras(options.extra);
      }
      
      if (options?.user) {
        scope.setUser(options.user);
      }
      
      Sentry.captureException(errorObj);
    });
  } catch (sentryError) {
    console.error('Failed to report error to Sentry:', sentryError);
    console.error('Original error:', errorObj);
  }
}

/**
 * Create a monitored version of a function that automatically reports errors
 */
export function withErrorMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  errorContext: string
): (...args: Parameters<T>) => ReturnType<T> {
  return function(...args: Parameters<T>): ReturnType<T> {
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
 */
export function withComponentErrorMonitoring(
  component: React.ComponentType<any>,
  componentName: string
): React.ComponentType<any> {
  return Sentry.withErrorBoundary(component, {
    fallback: (props) => React.createElement(ErrorFallback, { ...props, componentName })
  });
}

export default {
  captureError,
  captureMessage,
  withErrorMonitoring,
  withComponentErrorMonitoring
};
