
import * as Sentry from '@sentry/react';

/**
 * Set a tag in Sentry
 */
export const setTag = (key: string, value: string) => {
  if (Sentry) {
    Sentry.setTag(key, value);
  }
};

/**
 * Set context in Sentry
 */
export const setContext = (name: string, context: Record<string, any>) => {
  if (Sentry) {
    Sentry.setContext(name, context);
  }
};

/**
 * Capture message in Sentry
 */
export const captureMessage = (
  message: string, 
  options?: { 
    level?: Sentry.SeverityLevel,
    tags?: Record<string, string>,
    extra?: Record<string, any>,
    context?: Record<string, any>
  }
) => {
  if (Sentry) {
    if (options?.tags) {
      Object.entries(options.tags).forEach(([key, value]) => {
        setTag(key, value);
      });
    }
    
    if (options?.context) {
      Object.entries(options.context).forEach(([key, value]) => {
        setContext(key, value);
      });
    }
    
    Sentry.captureMessage(message, {
      level: options?.level || 'info',
      ...(options?.extra && { extra: options.extra })
    });
  }
};

/**
 * Capture error in Sentry
 */
export const captureError = (
  error: Error,
  options?: { 
    tags?: Record<string, string>,
    extra?: Record<string, any>
  }
) => {
  if (Sentry) {
    Sentry.captureException(error, {
      tags: options?.tags,
      extra: options?.extra
    });
  }
};
