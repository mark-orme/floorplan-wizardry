
/**
 * Sentry initialization utility
 * @module utils/sentry/initialization
 */
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import logger from '@/utils/logger';
import { setSentryInitialized } from './core';
import { captureError } from './errorCapture';

/**
 * Initialize Sentry SDK with configuration
 * This should be called early in the application lifecycle
 */
export function initializeSentry(): void {
  try {
    // Get environment variables
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    const environment = import.meta.env.MODE || 'development';
    const release = import.meta.env.VITE_APP_VERSION || 'development';
    
    // Skip initialization if DSN is not provided
    if (!dsn) {
      logger.info('Sentry initialization skipped: No DSN provided');
      return;
    }
    
    // Initialize Sentry SDK
    Sentry.init({
      dsn,
      environment,
      release,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/.*\.lovable\.app/],
        }),
      ],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: 0.2,
      // Adjust this value to control which errors are captured
      // Set to 0 to capture all errors
      // https://docs.sentry.io/platforms/javascript/configuration/filtering/
      ignoreErrors: [
        // Add patterns to ignore here, for example:
        // 'ResizeObserver loop limit exceeded',
        // 'Network request failed'
      ],
      beforeSend(event) {
        // Don't send events in development by default
        if (environment === 'development' && !import.meta.env.VITE_ENABLE_SENTRY_DEV) {
          return null;
        }
        return event;
      },
    });
    
    // Set initialization state
    setSentryInitialized(true);
    
    // Log successful initialization
    logger.info('Sentry initialized successfully', {
      environment,
      release,
    });
    
    // Set user-agent tag for all events
    Sentry.setTag('user-agent', navigator.userAgent);
  } catch (error) {
    // Log initialization error but don't crash the app
    logger.error('Failed to initialize Sentry:', error);
  }
}

/**
 * Configure additional Sentry context information
 * Call this after the app has initialized additional state
 */
export function configureSentryContext(context: {
  locale?: string;
  theme?: string;
  canvasInfo?: {
    width: number;
    height: number;
    objectCount: number;
  };
  userPreferences?: Record<string, unknown>;
}): void {
  try {
    if (!Sentry) return;
    
    // Set application context
    if (context.locale) {
      Sentry.setTag('locale', context.locale);
    }
    
    if (context.theme) {
      Sentry.setTag('theme', context.theme);
    }
    
    // Set canvas context if available
    if (context.canvasInfo) {
      Sentry.setContext('canvas', {
        dimensions: {
          width: context.canvasInfo.width,
          height: context.canvasInfo.height,
        },
        objects: context.canvasInfo.objectCount,
      });
    }
    
    // Set user preferences context
    if (context.userPreferences) {
      Sentry.setContext('preferences', context.userPreferences);
    }
  } catch (error) {
    logger.warn('Error configuring Sentry context:', error);
  }
}
