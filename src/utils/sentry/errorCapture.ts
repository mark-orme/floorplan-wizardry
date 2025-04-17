
import * as Sentry from '@sentry/react';
import logger from '../logger';
import { isSentryInitialized } from './core';
import { CaptureErrorOptions } from './types';
import { throttle } from '../throttleUtils';

const errorOccurrences: Record<string, { count: number; lastReported: number }> = {};
const ERROR_RATE_LIMIT = 5; // Maximum reports of the same error in a time window
const ERROR_RATE_WINDOW = 60000; // Time window in ms (1 minute)

/**
 * Enhanced error capture with improved security, rate limiting, and context
 */
export function captureError(
  error: Error | unknown, 
  errorId: string, 
  options: CaptureErrorOptions = {}
): void {
  // Sanitize and convert error to standard Error object
  const sanitizedError = error instanceof Error 
    ? error 
    : new Error(
        typeof error === 'string' 
          ? error 
          : error instanceof Object 
            ? JSON.stringify(error) 
            : 'Unknown error'
      );
  
  // Scrub potentially sensitive information
  const scrubbedMessage = sanitizeErrorMessage(sanitizedError.message);
  sanitizedError.message = `[${errorId}] ${scrubbedMessage}`;

  // Apply rate limiting to avoid flooding with the same error
  if (shouldRateLimitError(errorId)) {
    logger.debug(`Rate limited error [${errorId}]:`, { message: sanitizedError.message });
    return;
  }

  // Log error with different levels based on environment
  const logError = process.env.NODE_ENV === 'production' 
    ? logger.error 
    : console.error;

  logError(`Error Capture [${errorId}]:`, {
    message: sanitizedError.message,
    stack: sanitizedError.stack,
    context: options.extra
  });

  // Skip Sentry reporting in test environments
  if (process.env.NODE_ENV === 'test') return;

  try {
    if (isSentryInitialized()) {
      // Get drawing context info if available
      const drawingContext = getDrawingContextInfo();
      
      // Add security-focused tags
      const securityTags = {
        ...options.tags,
        errorId,
        severity: determineSeverity(sanitizedError),
        environment: process.env.NODE_ENV,
        ...drawingContext.tags
      };

      // Set Sentry context with scrubbed information
      Object.entries(securityTags).forEach(([key, value]) => {
        Sentry.setTag(key, String(value));
      });

      // Add user context if available
      if (options.user) {
        // Ensure we don't send raw user data
        const safeUserData = {
          ...options.user,
          email: options.user.email ? maskEmail(options.user.email) : undefined
        };
        Sentry.setUser(safeUserData);
      }

      // Enhance error context with drawing/canvas info
      Sentry.setContext('drawingContext', drawingContext.context);
      
      // Add session information if available
      if (typeof window !== 'undefined' && window.sessionStorage?.getItem('drawingSessionId')) {
        Sentry.setContext('sessionInfo', {
          drawingSessionId: window.sessionStorage.getItem('drawingSessionId'),
          sessionStartTime: window.sessionStorage.getItem('sessionStartTime'),
          canvasOperationsCount: window.sessionStorage.getItem('canvasOperationsCount') || '0'
        });
      }
      
      // Add error context
      if (options.context) {
        Sentry.setContext('errorContext', options.context);
      }

      // Capture with additional context
      const eventId = Sentry.captureException(sanitizedError, {
        tags: securityTags,
        extra: {
          ...options.extra,
          errorSource: errorId,
          rateInfo: errorOccurrences[errorId],
          ...drawingContext.extra
        }
      });

      logger.info(`Sentry event captured: ${eventId}`, { errorId });

      // Optionally show report dialog in production
      if (options.showReportDialog && process.env.NODE_ENV === 'production') {
        Sentry.showReportDialog({ eventId });
      }
    }
  } catch (sentryError) {
    console.error('Sentry reporting failed:', sentryError);
  }
}

/**
 * Rate limit errors to prevent flooding
 * @param errorId Unique identifier for the error
 * @returns Whether the error should be rate limited
 */
function shouldRateLimitError(errorId: string): boolean {
  const now = Date.now();
  
  // Initialize tracking if this is a new error
  if (!errorOccurrences[errorId]) {
    errorOccurrences[errorId] = { count: 1, lastReported: now };
    return false;
  }
  
  const errorData = errorOccurrences[errorId];
  
  // Reset counter if outside the time window
  if (now - errorData.lastReported > ERROR_RATE_WINDOW) {
    errorOccurrences[errorId] = { count: 1, lastReported: now };
    return false;
  }
  
  // Increment counter
  errorData.count++;
  errorData.lastReported = now;
  
  // Rate limit if threshold exceeded
  return errorData.count > ERROR_RATE_LIMIT;
}

/**
 * Sanitize error messages to remove potentially sensitive information
 */
function sanitizeErrorMessage(message: string): string {
  // Remove email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  message = message.replace(emailRegex, '[EMAIL REDACTED]');

  // Remove potential secret/token patterns
  const secretRegex = /(secret|token|key|password|auth|apikey|api_key|access)[\s:=]+['"]?\S+['"]?/gi;
  message = message.replace(secretRegex, '$1: [REDACTED]');
  
  // Remove potential JWT tokens
  const jwtRegex = /eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}/g;
  message = message.replace(jwtRegex, '[JWT REDACTED]');
  
  // Remove potential URLs with credentials
  const urlWithCredsRegex = /(https?:\/\/)([^:@\/\n]+):([^@\/\n]+)@/gi;
  message = message.replace(urlWithCredsRegex, '$1[USERNAME]:[PASSWORD]@');

  return message;
}

/**
 * Mask an email address for privacy
 * @param email Email address to mask
 * @returns Masked email address
 */
function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return '[INVALID EMAIL]';
  
  const name = parts[0];
  const domain = parts[1];
  
  // Keep first 2 chars and last char, mask the rest
  const maskedName = name.length <= 3 
    ? name[0] + '*' 
    : name.substring(0, 2) + '***' + name.charAt(name.length - 1);
  
  return `${maskedName}@${domain}`;
}

/**
 * Determine error severity based on error characteristics
 */
function determineSeverity(error: Error): 'low' | 'medium' | 'high' {
  const message = error.message.toLowerCase();
  
  if (message.includes('unauthorized') || 
      message.includes('authentication') || 
      message.includes('permission') ||
      message.includes('forbidden') ||
      message.includes('csrf') ||
      message.includes('xss') ||
      message.includes('injection')) {
    return 'high';
  }
  
  if (message.includes('network') || 
      message.includes('connection') || 
      message.includes('timeout') ||
      message.includes('unavailable')) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Get context information from the drawing/canvas state
 * This enriches error reports with drawing tool state
 */
function getDrawingContextInfo(): { tags: Record<string, string>, context: Record<string, any>, extra: Record<string, any> } {
  const result = {
    tags: {} as Record<string, string>,
    context: {} as Record<string, any>,
    extra: {} as Record<string, any>
  };
  
  try {
    // Try to get current tool from global window state if available
    if (typeof window !== 'undefined' && window.__app_state?.drawing?.currentTool) {
      result.tags.currentTool = window.__app_state.drawing.currentTool;
    }
    
    // Try to get canvas dimensions if available
    if (typeof window !== 'undefined' && window.__canvas_state) {
      result.context.canvasInfo = {
        width: window.__canvas_state.width,
        height: window.__canvas_state.height,
        zoomLevel: window.__canvas_state.zoom,
        objectCount: window.__canvas_state.objectCount
      };
    }
    
    // Add device pixel ratio
    if (typeof window !== 'undefined') {
      result.context.devicePixelRatio = window.devicePixelRatio;
      
      // Add browser information
      result.context.browser = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        vendor: navigator.vendor,
        platform: navigator.platform
      };
    }
    
  } catch (error) {
    // Ignore errors from context gathering as they shouldn't 
    // prevent the main error from being reported
    console.error('Error gathering context for Sentry:', error);
  }
  
  return result;
}

// Create throttled version for high-frequency environments
export const captureErrorThrottled = throttle(captureError, 1000);
