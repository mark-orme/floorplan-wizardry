
/**
 * Sentry initialization module
 * @module main/sentrySetup
 */
import * as Sentry from '@sentry/react';

/**
 * Configure Sentry to report TypeScript errors
 * @param dsn Sentry DSN
 */
function configureTypeErrorReporting() {
  // Set up a global error handler to catch and report TypeScript errors
  window.addEventListener('error', (event) => {
    // Check if the error is a TypeScript error
    const errorMessage = event.message || '';
    if (
      errorMessage.includes('TypeError') ||
      errorMessage.includes('is not assignable to type') ||
      errorMessage.includes('is not a function') ||
      errorMessage.includes('cannot read property') ||
      errorMessage.includes('is undefined') ||
      errorMessage.includes('is null')
    ) {
      // Set context for the error
      Sentry.setContext('typescript_error', {
        message: errorMessage,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
      
      // Set tags for easier filtering
      Sentry.setTag('error_type', 'typescript');
      
      // Capture the error
      Sentry.captureException(event.error || new Error(errorMessage), {
        level: 'error',
        tags: {
          typescript_error: 'true'
        }
      });
    }
  });
}

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
  
  // Configure type error reporting
  configureTypeErrorReporting();
  
  console.info(`Sentry initialized for ${environment} environment`);
}
