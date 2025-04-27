
/**
 * Sentry utility functions for error tracking
 * This is a simple mock implementation
 */

export interface CaptureOptions {
  level?: 'info' | 'warning' | 'error' | 'fatal';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export const captureMessage = (message: string, options?: CaptureOptions): string => {
  console.log(`[${options?.level || 'info'}] ${message}`, options?.extra || '');
  return 'mocked-event-id';
};

export const captureException = (error: Error, options?: CaptureOptions): string => {
  console.error(`[${options?.level || 'error'}] Exception:`, error, options?.extra || '');
  return 'mocked-exception-id';
};
