
/**
 * Enhanced error monitoring utilities
 * Provides standardized error reporting with contextual information
 */

import * as Sentry from '@sentry/react';
import { captureError } from './sentryUtils';

/**
 * Capture an error with detailed monitoring information
 * 
 * @param error Error to be captured
 * @param component Component where the error occurred
 * @param action Action being performed when the error occurred
 * @param options Additional options for error reporting
 */
export const captureErrorWithMonitoring = (
  error: Error,
  component: string,
  action: string,
  options?: {
    tags?: Record<string, string>,
    context?: Record<string, any>,
    user?: {
      id?: string,
      email?: string
    }
  }
) => {
  // First log to console for local debugging
  console.error(`[Error] ${component} / ${action}:`, error);

  // Then capture with Sentry
  captureError(error, {
    tags: {
      component,
      action,
      ...options?.tags
    },
    extra: {
      component,
      action,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...options?.context
    }
  });
};

/**
 * Add diagnostic information to the Sentry scope
 */
export const addDiagnosticInfo = () => {
  try {
    Sentry.setTag('screen_size', `${window.innerWidth}x${window.innerHeight}`);
    Sentry.setTag('device_pixel_ratio', window.devicePixelRatio.toString());
    Sentry.setContext('browser_info', {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      cookiesEnabled: navigator.cookieEnabled
    });
  } catch (e) {
    console.error('Error adding diagnostic info to Sentry', e);
  }
};
