
/**
 * Sentry utility functions
 */

/**
 * Capture an error message with optional metadata
 * @param message Message to capture
 * @param options Optional metadata
 */
export function captureMessage(message: string, options: any = {}): void {
  // Implementation would use Sentry's API, this is a stub
  console.log('[Sentry]', message, options);
}

/**
 * Capture an error with optional metadata
 * @param error Error to capture
 * @param options Optional metadata
 */
export function captureError(error: Error | unknown, options: any = {}): void {
  // Implementation would use Sentry's API, this is a stub
  console.error('[Sentry]', error, options);
}
