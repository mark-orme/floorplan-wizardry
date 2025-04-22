
/**
 * Sentry utility functions
 * Provides standardized wrappers for Sentry reporting
 */
import * as Sentry from '@sentry/react';

interface CaptureMessageOptions {
  level?: 'info' | 'warning' | 'error';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
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
export function captureException(error: Error, options?: CaptureMessageOptions): void {
  if (options?.tags) {
    Object.entries(options.tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  if (options?.extra) {
    Sentry.setContext('extra', options.extra);
  }

  Sentry.captureException(error);
}
