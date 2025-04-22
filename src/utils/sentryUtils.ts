
/**
 * Utility functions for Sentry error reporting
 */

export function captureMessage(message: string, options: any = {}) {
  console.log('[Sentry]', message, options);
  return 'fake-event-id';
}

export function captureException(error: Error, options: any = {}) {
  console.error('[Sentry]', error, options);
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
