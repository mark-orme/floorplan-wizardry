
/**
 * Utility functions for Sentry error reporting
 */

interface CaptureOptions {
  context?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: Record<string, any>;
  floorPlanId?: string;
  level?: string;
  [key: string]: any;
}

export function captureMessage(message: string, options: CaptureOptions = {}) {
  console.log('[Sentry]', message, options);
  return 'fake-event-id';
}

export function captureException(error: Error, options: CaptureOptions = {}) {
  console.error('[Sentry]', error, options);
  return 'fake-event-id';
}

export function captureError(error: Error, options: CaptureOptions = {}) {
  console.error('[Sentry] Error captured:', error);
  console.error('[Sentry] Options:', options);
  return 'fake-event-id';
}

export function startTransaction(context: any) {
  console.log('[Sentry] Starting transaction', context);
  return {
    setTag: (key: string, value: string) => console.log(`[Sentry] Setting tag: ${key}=${value}`),
    setData: (key: string, value: any) => console.log(`[Sentry] Setting data: ${key}=${JSON.stringify(value)}`),
    finish: () => console.log('[Sentry] Transaction finished')
  };
}
