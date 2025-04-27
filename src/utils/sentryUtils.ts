
// Simple Sentry-like error reporting utility

/**
 * Level for message capture
 */
export type CaptureLevel = 'info' | 'warning' | 'error' | 'fatal';

/**
 * Options for message capture
 */
export interface CaptureMessageOptions {
  level?: CaptureLevel;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture a message for error reporting
 * @param message Message to capture
 * @param options Capture options
 */
export function captureMessage(message: string, options: CaptureMessageOptions = {}) {
  const { level = 'info', tags = {}, extra = {} } = options;
  
  // In production, this would send to Sentry
  // For now, just log to console based on level
  switch (level) {
    case 'info':
      console.info(`[Capture] ${message}`, { tags, extra });
      break;
    case 'warning':
      console.warn(`[Capture] ${message}`, { tags, extra });
      break;
    case 'error':
    case 'fatal':
      console.error(`[Capture] ${message}`, { tags, extra });
      break;
    default:
      console.log(`[Capture] ${message}`, { tags, extra });
  }
}

/**
 * Capture an exception for error reporting
 * @param error Error to capture
 * @param options Capture options
 */
export function captureException(error: Error, options: CaptureMessageOptions = {}) {
  const { tags = {}, extra = {} } = options;
  
  // In production, this would send to Sentry
  console.error(`[Capture Exception] ${error.name}: ${error.message}`, {
    tags,
    extra,
    stack: error.stack
  });
}
