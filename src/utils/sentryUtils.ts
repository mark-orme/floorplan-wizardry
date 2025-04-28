
/**
 * Utility functions for Sentry integration
 */

type SentryMessageLevel = 'info' | 'warning' | 'error' | 'debug';

interface SentryMessageOptions {
  level?: SentryMessageLevel;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture a message to Sentry
 * In development, this just logs to console
 */
export const captureMessage = (
  message: string,
  options: SentryMessageOptions = {}
) => {
  const { level = 'info', tags = {}, extra = {} } = options;
  
  // In development, just log to console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${level.toUpperCase()}]`, message, { tags, extra });
    return;
  }
  
  // In production, this would send to Sentry
  // Sentry.captureMessage(message, {
  //   level,
  //   tags,
  //   extra
  // });
};

/**
 * Capture an exception to Sentry
 * In development, this just logs to console
 */
export const captureException = (
  error: Error,
  options: SentryMessageOptions = {}
) => {
  const { level = 'error', tags = {}, extra = {} } = options;
  
  // In development, just log to console
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${level.toUpperCase()}]`, error, { tags, extra });
    return;
  }
  
  // In production, this would send to Sentry
  // Sentry.captureException(error, {
  //   level,
  //   tags,
  //   extra
  // });
};
