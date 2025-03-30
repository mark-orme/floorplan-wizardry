
/**
 * Utility functions for error capture and reporting to Sentry
 */

interface ErrorCaptureOptions {
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Capture an error for Sentry reporting
 * Fall back to console logging when Sentry is not available
 * 
 * @param error The error to capture
 * @param errorId Unique identifier for the error
 * @param options Additional options for the error report
 */
export function captureError(
  error: Error, 
  errorId: string, 
  options: ErrorCaptureOptions = {}
): void {
  // Get the current environment
  const isProd = process.env.NODE_ENV === 'production';
  
  // Log the error to console
  if (isProd) {
    console.error(`[${errorId}]`, error.message);
  } else {
    console.error(`[${errorId}]`, error, options);
  }
  
  // In the future, we could add actual Sentry integration here
  // For now, we just log to console
  try {
    // Mock Sentry capture
    const level = options.level || 'error';
    console.info(`[Sentry Mock] Captured ${level} ${errorId}:`, error.message);
  } catch (captureError) {
    console.error('Failed to capture error:', captureError);
  }
}
