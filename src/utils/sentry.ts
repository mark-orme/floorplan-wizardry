
/**
 * Sentry Utilities
 * Utilities for error tracking and monitoring with Sentry
 */
import * as Sentry from '@sentry/react';

/**
 * Set canvas context for better error tracking
 * @param canvasState Current canvas state
 */
export function setCanvasContext(canvasState: {
  tool?: string;
  zoom?: number;
  width?: number;
  height?: number;
  objects?: number;
  [key: string]: any;
}): void {
  // Set tool as a tag for easier filtering
  if (canvasState.tool) {
    Sentry.setTag('canvas.tool', canvasState.tool);
  }
  
  // Set other properties as context
  Sentry.setContext('canvas', {
    dimensions: {
      width: canvasState.width,
      height: canvasState.height,
      zoom: canvasState.zoom
    },
    status: {
      objects: canvasState.objects,
      visible: canvasState.visible,
      mode: canvasState.mode
    },
    performance: {
      fps: canvasState.fps,
      renderTime: canvasState.renderTime
    }
  });
}

/**
 * Set user context for error tracking
 * @param user User information
 */
export function setUserContext(user: {
  id?: string;
  email?: string;
  role?: string;
}): void {
  if (user.id) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } else {
    // Clear user context if no ID is provided
    Sentry.setUser(null);
  }
}

/**
 * Capture an error with enhanced context
 * @param error Error object
 * @param operation Operation that caused the error
 * @param options Additional context options
 */
export function captureError(
  error: Error | unknown,
  operation: string,
  options: {
    tags?: Record<string, string>;
    context?: Record<string, any>;
    level?: Sentry.SeverityLevel;
  } = {}
): void {
  const { tags = {}, context = {}, level = 'error' } = options;
  
  // Set tags for filtering
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
  
  // Set operation tag
  Sentry.setTag('operation', operation);
  
  // Set additional context
  Sentry.setContext('operation_details', {
    name: operation,
    ...context
  });
  
  // Capture the error with the configured level
  if (error instanceof Error) {
    Sentry.captureException(error, {
      level
    });
  } else {
    Sentry.captureMessage(
      `Error in ${operation}: ${error}`,
      level
    );
  }
}

/**
 * Capture a message with context
 * @param message Message to capture
 * @param category Message category
 * @param options Additional context options
 */
export function captureMessage(
  message: string,
  category: string,
  options: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: Sentry.SeverityLevel;
  } = {}
): void {
  const { tags = {}, extra = {}, level = 'info' } = options;
  
  // Set tags for filtering
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
  
  // Set category tag
  Sentry.setTag('category', category);
  
  // Capture the message with context
  Sentry.captureMessage(message, {
    level,
    tags,
    extra
  });
}

/**
 * Start performance monitoring for an operation
 * @param operation Operation name
 * @returns Transaction object that should be finished when done
 */
export function startPerformanceMonitoring(operation: string): Sentry.Transaction {
  const transaction = Sentry.startTransaction({
    name: operation,
    op: 'canvas.render'
  });
  
  // Set the transaction as current
  Sentry.configureScope(scope => {
    scope.setSpan(transaction);
  });
  
  return transaction;
}

/**
 * Monitor a function's performance
 * @param fn Function to monitor
 * @param name Operation name
 * @returns Wrapped function with performance monitoring
 */
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const transaction = startPerformanceMonitoring(name);
    
    try {
      const result = fn(...args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result
          .then(value => {
            transaction.finish();
            return value;
          })
          .catch(error => {
            captureError(error, name);
            transaction.finish();
            throw error;
          }) as ReturnType<T>;
      }
      
      transaction.finish();
      return result;
    } catch (error) {
      captureError(error, name);
      transaction.finish();
      throw error;
    }
  };
}
