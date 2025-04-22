
/**
 * Sentry utility functions
 * Provides standardized wrappers for Sentry reporting
 */
import * as Sentry from '@sentry/react';

export interface CaptureMessageOptions {
  level?: 'info' | 'warning' | 'error';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: string;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
}

/**
 * Captures a message in Sentry with additional context
 * @param message Message to capture
 * @param options Optional configuration or context string
 */
export function captureMessage(message: string, options?: CaptureMessageOptions): void;
export function captureMessage(message: string, context?: string, options?: CaptureMessageOptions): void;
export function captureMessage(message: string, contextOrOptions?: string | CaptureMessageOptions, optionsArg?: CaptureMessageOptions): void {
  let options: CaptureMessageOptions | undefined;
  
  if (typeof contextOrOptions === 'string') {
    // Old-style call with context string
    options = {
      ...(optionsArg || {}),
      context: contextOrOptions
    };
  } else {
    // New-style call with options object
    options = contextOrOptions;
  }

  // Set tags from options
  if (options?.tags) {
    Object.entries(options.tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  // Set extra context from options
  if (options?.extra) {
    Sentry.setContext('extra', options.extra);
  }

  // Set context as a tag if provided
  if (options?.context) {
    Sentry.setTag('context', options.context);
  }

  // Determine Sentry severity level
  const sentryLevel = options?.level === 'info' ? 'info' : 
                      options?.level === 'warning' ? 'warning' : 'error';
  
  // Capture the message
  Sentry.captureMessage(message, sentryLevel);
}

/**
 * Captures an exception in Sentry with additional context
 * @param error Error to capture
 * @param options Optional configuration or error type string
 */
export function captureError(error: Error, options?: CaptureMessageOptions): void;
export function captureError(error: Error, errorType?: string, options?: CaptureMessageOptions): void;
export function captureError(error: Error, errorTypeOrOptions?: string | CaptureMessageOptions, optionsArg?: CaptureMessageOptions): void {
  let options: CaptureMessageOptions | undefined;
  
  if (typeof errorTypeOrOptions === 'string') {
    // Old-style call with errorType string
    options = {
      ...(optionsArg || {}),
      tags: {
        ...(optionsArg?.tags || {}),
        error_type: errorTypeOrOptions
      }
    };
  } else {
    // New-style call with options object
    options = errorTypeOrOptions;
  }

  // Set tags from options
  if (options?.tags) {
    Object.entries(options.tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  // Set extra context from options
  if (options?.extra) {
    Sentry.setContext('extra', options.extra);
  }

  // Set context as a tag if provided
  if (options?.context) {
    Sentry.setTag('context', options.context);
  }

  // Capture the exception
  Sentry.captureException(error);
}

// Export Sentry types to maintain compatibility with legacy code
export type { CaptureMessageOptions as SentryOptions };
export { Sentry };
