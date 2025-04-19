
/**
 * Sentry initialization module
 * @module main/sentrySetup
 */
import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking
 * @param dsn Sentry DSN
 * @param environment Environment name
 * @param release Release version
 */
export function setupSentry(
  dsn: string = '',
  environment: string = 'development',
  release: string = '1.0.0'
): void {
  // Skip Sentry setup if no DSN provided
  if (!dsn) {
    console.info('Sentry initialization skipped: No DSN provided');
    return;
  }
  
  // Initialize Sentry
  Sentry.init({
    dsn,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
    environment,
    release,
    beforeSend(event) {
      // Don't send events in development unless explicitly enabled
      if (environment !== 'production' && process.env.VITE_ENABLE_SENTRY_DEV !== 'true') {
        return null;
      }
      return event;
    }
  });
  
  console.info(`Sentry initialized for ${environment} environment`);
}
