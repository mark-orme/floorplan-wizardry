
/**
 * Sentry Utilities
 * Provides enhanced error tracking with Sentry
 */
import * as SentrySDK from '@sentry/react';
import { getDrawingSessionId } from '@/features/drawing/state/drawingMetrics';
import { CaptureErrorOptions, CaptureMessageOptions } from './types';

// Capture error with additional context
export function captureError(
  error: Error | unknown,
  errorType: string,
  options?: CaptureErrorOptions
) {
  // Default options
  const defaultOptions = {
    level: 'error',
    tags: {},
    extra: {},
    context: {},
    security: {}
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Get current app and canvas state
  const appState = typeof window !== 'undefined' ? window.__app_state : {};
  const canvasState = typeof window !== 'undefined' ? window.__canvas_state : {};
  
  // Get current drawing session
  const drawingSessionId = getDrawingSessionId();
  
  // Create Sentry scope
  SentrySDK.withScope((scope) => {
    // Set severity level
    scope.setLevel(mergedOptions.level as SentrySDK.SeverityLevel);
    
    // Set tags
    scope.setTags({
      errorType,
      drawingSession: drawingSessionId,
      ...mergedOptions.tags
    });
    
    // Set extra context
    scope.setExtras({
      appState,
      canvasState,
      ...mergedOptions.extra
    });
    
    // Set user context if provided
    if (mergedOptions.user) {
      scope.setUser(mergedOptions.user);
    }
    
    // Capture the error
    if (error instanceof Error) {
      SentrySDK.captureException(error);
    } else {
      SentrySDK.captureMessage(
        typeof error === 'string' ? error : `Unknown error: ${JSON.stringify(error)}`
      );
    }
  });
}

// Capture message with additional context
export function captureMessage(
  message: string,
  category: string,
  options?: CaptureMessageOptions
) {
  // Default options
  const defaultOptions = {
    level: 'info',
    tags: {},
    extra: {},
    context: {}
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Get current app and canvas state
  const appState = typeof window !== 'undefined' ? window.__app_state : {};
  const canvasState = typeof window !== 'undefined' ? window.__canvas_state : {};
  
  // Get current drawing session
  const drawingSessionId = getDrawingSessionId();
  
  // Create Sentry scope
  SentrySDK.withScope((scope) => {
    // Set severity level
    scope.setLevel(mergedOptions.level as SentrySDK.SeverityLevel);
    
    // Set tags
    scope.setTags({
      category,
      drawingSession: drawingSessionId,
      ...mergedOptions.tags
    });
    
    // Set extra context
    scope.setExtras({
      appState,
      canvasState,
      ...mergedOptions.extra
    });
    
    // Set user information if provided
    if (mergedOptions.user) {
      scope.setUser(mergedOptions.user);
    }
    
    // Capture the message
    SentrySDK.captureMessage(message);
  });
}

// Types for inputValidation error reporting
export interface InputValidationResult {
  valid: boolean;
  message?: string;
  fields?: Record<string, string[]>;
  severity?: 'low' | 'medium' | 'high';
}

// Export the Sentry SDK with a different name to avoid conflicts
export { SentrySDK };
