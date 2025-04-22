
/**
 * Sentry utility functions
 * Provides standardized wrappers for Sentry reporting
 */
import * as Sentry from '@sentry/react';

interface CaptureMessageOptions {
  level?: 'info' | 'warning' | 'error';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
}

/**
 * Captures a message in Sentry with additional context
 * @param message Message to capture
 * @param options Optional configuration
 */
export function captureMessage(message: string, options?: CaptureMessageOptions): void;
export function captureMessage(message: string, category: string, options?: CaptureMessageOptions): void;
export function captureMessage(message: string, categoryOrOptions?: string | CaptureMessageOptions, optionsArg?: CaptureMessageOptions): void {
  let category: string | undefined;
  let options: CaptureMessageOptions | undefined;

  if (typeof categoryOrOptions === 'string') {
    category = categoryOrOptions;
    options = optionsArg;
  } else {
    options = categoryOrOptions;
  }

  if (options?.tags) {
    Object.entries(options.tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  if (options?.extra) {
    Sentry.setContext('extra', options.extra);
  }

  if (category) {
    Sentry.setTag('category', category);
  }

  const sentryLevel = options?.level === 'info' ? 'info' : 
                      options?.level === 'warning' ? 'warning' : 'error';
  
  Sentry.captureMessage(message, sentryLevel);
}

/**
 * Captures an exception in Sentry with additional context
 * @param error Error to capture
 * @param options Optional configuration
 */
export function captureError(error: Error, options?: CaptureMessageOptions): void;
export function captureError(error: Error, errorType: string, options?: CaptureMessageOptions): void;
export function captureError(error: Error, errorTypeOrOptions?: string | CaptureMessageOptions, optionsArg?: CaptureMessageOptions): void {
  let errorType: string | undefined;
  let options: CaptureMessageOptions | undefined;

  if (typeof errorTypeOrOptions === 'string') {
    errorType = errorTypeOrOptions;
    options = optionsArg;
  } else {
    options = errorTypeOrOptions;
  }

  if (options?.tags) {
    Object.entries(options.tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  if (options?.extra) {
    Sentry.setContext('extra', options.extra);
  }

  if (errorType) {
    Sentry.setTag('error_type', errorType);
  }

  Sentry.captureException(error);
}

// Export Sentry types to maintain compatibility with legacy code
export type { CaptureMessageOptions as SentryOptions };
export { Sentry };
