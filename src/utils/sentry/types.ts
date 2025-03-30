
/**
 * Sentry utility type definitions
 * @module utils/sentry/types
 */
import * as Sentry from '@sentry/react';

/**
 * Error capture options
 */
export interface ErrorCaptureOptions {
  /** Error severity level */
  level?: "error" | "warning" | "info";
  /** Additional tags for categorization */
  tags?: Record<string, string>;
  /** Additional context data */
  extra?: Record<string, any>;
  /** User information */
  user?: {
    id?: string;
    email?: string;
    username?: string;
    ip_address?: string;
  };
  /** Whether to show the report dialog to the user */
  showReportDialog?: boolean;
  /** Additional fingerprinting information */
  fingerprint?: string[];
}

/**
 * Severity level mapping
 * Maps our level strings to Sentry severity levels
 */
export const severityMap: Record<string, Sentry.SeverityLevel> = {
  'error': 'error',
  'warning': 'warning',
  'info': 'info',
  'debug': 'debug',
  'log': 'log',
  'fatal': 'fatal'
};

/**
 * Get appropriate Sentry severity level
 * @param {string} level - The severity level string
 * @returns {Sentry.SeverityLevel} Proper Sentry severity level
 */
export function getSentryLevel(level: string): Sentry.SeverityLevel {
  return severityMap[level] || 'info';
}
