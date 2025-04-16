
/**
 * Canvas error reporting utilities
 * @module utils/canvas/monitoring/errorReporting
 */

import { ErrorCategory, ErrorSeverity, CanvasErrorInfo } from './errorTypes';
import { captureError, captureMessage } from '@/utils/sentryUtils';

/**
 * Track canvas initialization attempts
 * @param canvasId - Canvas identifier
 * @param options - Additional info about the attempt
 * @returns The attempt number
 */
export const logCanvasInitAttempt = (canvasId: string, options?: Record<string, any>): number => {
  // Get initialization counter from storage or initialize it
  const canvasInitCounter = (window as any).__canvas_init_count || {};
  const currentAttempt = (canvasInitCounter[canvasId] || 0) + 1;
  
  // Update initialization counter
  canvasInitCounter[canvasId] = currentAttempt;
  (window as any).__canvas_init_count = canvasInitCounter;
  
  // Log attempt
  console.log(`Canvas initialization attempt ${currentAttempt} for ${canvasId}`);
  
  // Capture diagnostic info for multiple attempts
  if (currentAttempt > 1) {
    captureMessage(`Canvas initialization attempt ${currentAttempt} for ${canvasId}`, 'canvas-init-attempt', {
      level: currentAttempt > 3 ? 'warning' : 'info',
      tags: {
        component: 'Canvas',
        operation: 'initialization',
        canvasId,
        attempt: String(currentAttempt)
      },
      extra: {
        options,
        documentReady: document.readyState,
        timestamp: Date.now()
      }
    });
  }
  
  return currentAttempt;
};

/**
 * Track successful canvas initialization
 * @param canvasId - Canvas identifier
 * @param duration - Time it took to initialize in ms
 * @param details - Additional details about initialization
 */
export const logCanvasInitSuccess = (
  canvasId: string, 
  duration: number,
  details?: Record<string, any>
): void => {
  console.log(`Canvas ${canvasId} initialized successfully in ${duration}ms`);
  
  // Reset initialization counter
  const canvasInitCounter = (window as any).__canvas_init_count || {};
  canvasInitCounter[canvasId] = 0;
  (window as any).__canvas_init_count = canvasInitCounter;
  
  // Capture success message
  captureMessage(`Canvas initialized successfully in ${duration}ms`, 'canvas-init-success', {
    level: 'info',
    tags: {
      component: 'Canvas',
      operation: 'initialization',
      canvasId
    },
    extra: {
      duration,
      ...details,
      timestamp: Date.now()
    }
  });
};

/**
 * Handle canvas initialization errors
 * @param error - The error that occurred
 * @param canvasId - Canvas identifier
 * @param canvasElement - Canvas DOM element
 * @param attempt - Initialization attempt number
 * @returns Whether this is a fatal error
 */
export const handleCanvasInitError = (
  error: unknown,
  canvasId: string,
  canvasElement: HTMLCanvasElement | null,
  attempt: number
): boolean => {
  const errorMsg = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Determine error severity based on attempt count and error type
  const isFatalError = attempt >= 3 || errorMsg.includes('lower.el') || errorMsg.includes('already initialized');
  
  // Log detailed error information
  console.error(`Canvas initialization error (${isFatalError ? 'FATAL' : 'RETRY'}):`, {
    error: errorMsg,
    canvasId,
    attempt,
    canvasElement: !!canvasElement,
    canvasElementBounds: canvasElement ? canvasElement.getBoundingClientRect() : null
  });
  
  // Create error info for reporting
  const errorInfo: CanvasErrorInfo = {
    message: errorMsg,
    category: ErrorCategory.INITIALIZATION,
    severity: isFatalError ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH,
    stack: errorStack,
    timestamp: Date.now(),
    context: {
      canvasId,
      attempt,
      isFatal: isFatalError,
      canvasElement: !!canvasElement,
      canvasAttributes: canvasElement ? {
        width: canvasElement.width,
        height: canvasElement.height
      } : null
    }
  };
  
  // Report to monitoring service
  captureError(error instanceof Error ? error : new Error(errorMsg), 'canvas-init-error', {
    level: isFatalError ? 'fatal' : 'error',
    tags: {
      component: 'Canvas',
      operation: 'initialization',
      canvasId,
      attempt: String(attempt)
    },
    extra: errorInfo.context
  });
  
  return isFatalError;
};
