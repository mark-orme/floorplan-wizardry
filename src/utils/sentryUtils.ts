
/**
 * Sentry utility functions for error reporting
 */

export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error('[Sentry]', error, context);
};

export const captureMessage = (message: string, options?: {
  level?: 'info' | 'warning' | 'error',
  tags?: Record<string, string>,
  extra?: Record<string, any>
}) => {
  if (options?.level === 'error') {
    console.error('[Sentry]', message, options);
  } else if (options?.level === 'warning') {
    console.warn('[Sentry]', message, options);
  } else {
    console.info('[Sentry]', message, options);
  }
};

export const captureError = captureException;

// Alias for backwards compatibility
export const captureEvent = captureMessage;
