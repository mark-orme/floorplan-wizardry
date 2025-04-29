
/**
 * Utility functions for Sentry error reporting
 * Stub implementation for development
 */

export function captureMessage(message: string, options?: any): string {
  console.log(`[Sentry] Message captured: ${message}`, options);
  return 'mock-event-id';
}

export function captureError(error: Error, options?: any): string {
  console.error(`[Sentry] Error captured:`, error, options);
  return 'mock-event-id';
}

export function captureException(exception: any, options?: any): string {
  console.error(`[Sentry] Exception captured:`, exception, options);
  return 'mock-event-id';
}
