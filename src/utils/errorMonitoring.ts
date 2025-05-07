
/**
 * Enhanced error monitoring utilities
 * Provides standardized error reporting with contextual information
 */

import * as Sentry from '@sentry/react';
import { captureError } from './sentryUtils';
import { ErrorSeverity } from './errorReporting';

export type ErrorSeverityLevel = 'critical' | 'error' | 'warning' | 'info';

interface ErrorMonitoringOptions {
  tags?: Record<string, string>;
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
  };
  level?: ErrorSeverityLevel;
}

/**
 * Map severity level to Sentry level
 */
function mapSeverityLevel(severity: ErrorSeverityLevel): Sentry.SeverityLevel {
  switch (severity) {
    case 'critical':
      return 'fatal';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'error';
  }
}

/**
 * Map severity level to ErrorSeverity enum
 */
function mapToErrorSeverity(severity: ErrorSeverityLevel): ErrorSeverity {
  switch (severity) {
    case 'critical':
      return ErrorSeverity.CRITICAL;
    case 'error':
      return ErrorSeverity.HIGH;
    case 'warning':
      return ErrorSeverity.MEDIUM;
    case 'info':
      return ErrorSeverity.LOW;
    default:
      return ErrorSeverity.MEDIUM;
  }
}

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
  options?: ErrorMonitoringOptions
): void => {
  // Ensure error is an Error object
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Default to error severity
  const severity = options?.level || 'error';
  
  // First log to console for local debugging
  console.error(`[${severity.toUpperCase()}] ${component} / ${action}:`, errorObj);

  // Then capture with Sentry
  captureError(errorObj, {
    tags: {
      component,
      action,
      ...options?.tags
    },
    level: mapSeverityLevel(severity),
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
export const addDiagnosticInfo = (): void => {
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
