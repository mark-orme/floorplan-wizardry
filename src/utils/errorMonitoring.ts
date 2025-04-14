
/**
 * Error Monitoring Utilities
 * Provides centralized error monitoring and rate limiting functionality
 * @module utils/errorMonitoring
 */

import { captureError, captureMessage } from './sentryUtils';
import logger from './logger';

// Track error occurrences for global monitoring
interface ErrorOccurrence {
  count: number;
  lastReported: number;
  contexts: Set<string>;
}

// System-wide error tracking
const ERROR_MONITORING_WINDOW = 5 * 60 * 1000; // 5 minutes
const systemErrors: Record<string, ErrorOccurrence> = {};

// Error rate thresholds for system-wide monitoring
const ERROR_RATE_THRESHOLDS = {
  low: 5,    // 5 errors of same type in 5 minutes is concerning
  medium: 15, // 15 errors of same type in 5 minutes is problematic
  high: 30    // 30 errors of same type in 5 minutes indicates a serious issue
};

/**
 * Track system-wide error rates to detect potential issues
 * @param errorType Type of error
 * @param context Error context
 */
export function monitorErrorRate(errorType: string, context: string): void {
  const now = Date.now();
  const errorKey = errorType;
  
  // Initialize or update error occurrence
  if (!systemErrors[errorKey]) {
    systemErrors[errorKey] = {
      count: 1,
      lastReported: now,
      contexts: new Set([context])
    };
  } else {
    const errorData = systemErrors[errorKey];
    
    // Reset if outside monitoring window
    if (now - errorData.lastReported > ERROR_MONITORING_WINDOW) {
      systemErrors[errorKey] = {
        count: 1,
        lastReported: now,
        contexts: new Set([context])
      };
      return;
    }
    
    // Update tracking data
    errorData.count++;
    errorData.lastReported = now;
    errorData.contexts.add(context);
    
    // Check thresholds and report if necessary
    if (errorData.count === ERROR_RATE_THRESHOLDS.low) {
      // Low threshold reached
      captureMessage(
        `Error rate warning: ${errorKey} occurred ${errorData.count} times in ${ERROR_MONITORING_WINDOW/60000} minutes`,
        'error-rate-warning',
        {
          level: 'warning',
          tags: {
            errorType: errorKey,
            errorCount: String(errorData.count),
            timeWindow: `${ERROR_MONITORING_WINDOW/60000} minutes`
          },
          extra: {
            contexts: Array.from(errorData.contexts),
            errorData
          }
        }
      );
      
      logger.warn(`Error rate warning: ${errorKey} (${errorData.count} occurrences)`);
    } else if (errorData.count === ERROR_RATE_THRESHOLDS.medium) {
      // Medium threshold reached
      captureMessage(
        `Error rate alert: ${errorKey} occurred ${errorData.count} times in ${ERROR_MONITORING_WINDOW/60000} minutes`,
        'error-rate-alert',
        {
          level: 'error',
          tags: {
            errorType: errorKey,
            errorCount: String(errorData.count),
            timeWindow: `${ERROR_MONITORING_WINDOW/60000} minutes`
          },
          extra: {
            contexts: Array.from(errorData.contexts),
            errorData
          }
        }
      );
      
      logger.error(`Error rate alert: ${errorKey} (${errorData.count} occurrences)`);
    } else if (errorData.count === ERROR_RATE_THRESHOLDS.high) {
      // High threshold reached - critical issue
      captureError(
        new Error(`Critical error rate: ${errorKey} occurred ${errorData.count} times in ${ERROR_MONITORING_WINDOW/60000} minutes`),
        'error-rate-critical',
        {
          level: 'fatal',
          tags: {
            errorType: errorKey,
            errorCount: String(errorData.count),
            timeWindow: `${ERROR_MONITORING_WINDOW/60000} minutes`
          },
          extra: {
            contexts: Array.from(errorData.contexts),
            errorData
          }
        }
      );
      
      logger.error(`CRITICAL ERROR RATE: ${errorKey} (${errorData.count} occurrences)`);
    }
  }
}

/**
 * Reset error monitoring for testing or after recovery
 */
export function resetErrorMonitoring(): void {
  Object.keys(systemErrors).forEach(key => {
    delete systemErrors[key];
  });
}

/**
 * Get current error statistics
 * @returns Error statistics for monitoring
 */
export function getErrorStatistics(): Record<string, any> {
  const now = Date.now();
  const stats: Record<string, any> = {};
  
  Object.entries(systemErrors).forEach(([key, data]) => {
    // Only include active errors (within window)
    if (now - data.lastReported <= ERROR_MONITORING_WINDOW) {
      stats[key] = {
        count: data.count,
        lastReported: new Date(data.lastReported).toISOString(),
        contexts: Array.from(data.contexts),
        timeSinceLastError: Math.round((now - data.lastReported) / 1000) + ' seconds',
        status: data.count >= ERROR_RATE_THRESHOLDS.high 
          ? 'critical' 
          : data.count >= ERROR_RATE_THRESHOLDS.medium 
            ? 'high' 
            : data.count >= ERROR_RATE_THRESHOLDS.low 
              ? 'medium' 
              : 'low'
      };
    }
  });
  
  return stats;
}

// Export enhanced error capture with automatic monitoring
export function captureErrorWithMonitoring(
  error: Error | unknown,
  errorId: string,
  context: string,
  options: any = {}
): void {
  // Track in monitoring system
  monitorErrorRate(errorId, context);
  
  // Convert unknown errors to Error objects for proper handling
  const normalizedError = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' 
        ? error 
        : 'Unknown error');
  
  // Forward to Sentry
  captureError(normalizedError, errorId, {
    ...options,
    extra: {
      ...(options.extra || {}),
      monitoringContext: context,
      originalError: error // Keep the original error for reference
    }
  });
}

/**
 * Check if error rate indicates a system issue
 * @param errorType Type of error to check
 * @returns Whether there's a system issue with this error type
 */
export function isSystemIssue(errorType: string): boolean {
  const errorData = systemErrors[errorType];
  if (!errorData) return false;
  
  const now = Date.now();
  if (now - errorData.lastReported > ERROR_MONITORING_WINDOW) return false;
  
  return errorData.count >= ERROR_RATE_THRESHOLDS.medium;
}
