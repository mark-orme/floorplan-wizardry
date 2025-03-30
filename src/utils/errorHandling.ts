
/**
 * Error handling utilities
 * Provides consistent error handling, logging, and reporting
 * 
 * @module utils/errorHandling
 */
import { captureError } from './sentryUtils';
import logger from './logger';
import { toast } from 'sonner';

/**
 * Error handling options
 */
interface ErrorHandlingOptions {
  /** Component name */
  component?: string;
  /** Operation being performed */
  operation?: string;
  /** Additional context information */
  context?: Record<string, any>;
  /** Additional data related to the error */
  data?: Record<string, any>;
  /** Whether to show toast notification */
  showToast?: boolean;
  /** Toast message (defaults to error message) */
  toastMessage?: string;
  /** Error level */
  level?: 'error' | 'warning' | 'info';
  /** Whether to retry the operation */
  retry?: boolean;
  /** Retry callback */
  retryFn?: () => void;
  /** Whether this is a critical error */
  critical?: boolean;
}

/**
 * Handle error with appropriate logging, reporting, and user feedback
 * 
 * @param {Error | unknown} error - Error to handle
 * @param {ErrorHandlingOptions} options - Error handling options
 * @returns {void}
 */
export const handleError = (error: Error | unknown, options: ErrorHandlingOptions = {}): void => {
  const { 
    component = 'unknown', 
    operation = 'unknown', 
    context = {}, 
    data = {}, 
    showToast = false,
    toastMessage,
    level = 'error',
    retry = false,
    retryFn,
    critical = false
  } = options;
  
  // Convert unknown error to Error object with sensible default message
  const errorObj = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' ? error : 'An unknown error occurred');
  
  // Log to console with context
  console.error(`[${component}/${operation}] Error:`, errorObj, { context, data });
  
  // Log to application logger
  logger.error(`Error in ${component}/${operation}: ${errorObj.message}`, {
    component,
    operation,
    context,
    data,
    stack: errorObj.stack
  });
  
  // Create diagnostic info
  const diagnosticInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    component,
    operation,
    context,
    data,
    errorMessage: errorObj.message,
    errorName: errorObj.name,
    errorStack: errorObj.stack,
    browserInfo: typeof navigator !== 'undefined' ? {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    } : 'Not available'
  };
  
  // Report to Sentry with enhanced context
  captureError(errorObj, `${component}-${operation}`, {
    level: critical ? 'error' : level,
    tags: {
      component,
      operation,
      errorType: errorObj.name,
      critical: critical ? 'true' : 'false'
    },
    extra: diagnosticInfo
  });
  
  // Show toast notification if requested
  if (showToast) {
    const message = toastMessage || errorObj.message;
    
    if (retry && retryFn) {
      toast.error(message, {
        action: {
          label: 'Retry',
          onClick: retryFn
        }
      });
    } else {
      toast.error(message);
    }
  }
};

/**
 * Create a retry function with exponential backoff
 * 
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Function} Function that executes with retry capability
 */
export const withRetry = <T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  baseDelay: number = 500
): () => Promise<T> => {
  return async (): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error during retry');
        
        // If we've reached max retries, throw the error
        if (attempt === maxRetries) {
          handleError(lastError, {
            component: 'retry-mechanism',
            operation: 'final-attempt',
            context: { attempts: attempt + 1, maxRetries },
            data: { lastError },
            critical: true,
            showToast: true,
            toastMessage: 'Operation failed after multiple attempts'
          });
          
          throw lastError;
        }
        
        // Log the retry attempt
        logger.warn(`Retry attempt ${attempt + 1}/${maxRetries + 1} after error: ${lastError.message}`);
        
        // Wait with exponential backoff before next attempt
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // This should never be reached, but TypeScript requires a return
    throw lastError || new Error('Unexpected error in retry mechanism');
  };
};

/**
 * Safely execute a function and handle any errors
 * 
 * @param {Function} fn - Function to execute
 * @param {ErrorHandlingOptions} options - Error handling options
 * @returns {T | null} Result of the function or null if an error occurred
 */
export const trySafe = <T>(fn: () => T, options: ErrorHandlingOptions = {}): T | null => {
  try {
    return fn();
  } catch (error) {
    handleError(error, options);
    return null;
  }
};

/**
 * Safely execute an async function and handle any errors
 * 
 * @param {Function} fn - Async function to execute
 * @param {ErrorHandlingOptions} options - Error handling options
 * @returns {Promise<T | null>} Result of the function or null if an error occurred
 */
export const trySafeAsync = async <T>(
  fn: () => Promise<T>, 
  options: ErrorHandlingOptions = {}
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, options);
    return null;
  }
};
