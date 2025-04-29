
/**
 * Utility for Sentry error reporting
 */

export interface CaptureMessageOptions {
  level?: 'info' | 'warning' | 'error';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture a message for error reporting
 * @param message The message to capture
 * @param options Additional options for the message
 */
export function captureMessage(message: string, options: CaptureMessageOptions = {}): void {
  // In a real implementation, this would send to Sentry
  // For now, just log to console with level-appropriate method
  const { level = 'info', tags = {}, extra = {} } = options;
  
  const logData = {
    message,
    tags,
    extra,
    timestamp: new Date().toISOString()
  };
  
  switch (level) {
    case 'error':
      console.error('[SENTRY]', logData);
      break;
    case 'warning':
      console.warn('[SENTRY]', logData);
      break;
    default:
      console.info('[SENTRY]', logData);
  }
}

/**
 * Capture an exception for error reporting
 * @param error The error to capture
 * @param options Additional options for the error
 */
export function captureException(error: Error, options: CaptureMessageOptions = {}): void {
  // In a real implementation, this would send to Sentry
  console.error('[SENTRY] Exception:', error, options);
}
