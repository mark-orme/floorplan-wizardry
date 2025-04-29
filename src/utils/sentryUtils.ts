
/**
 * Utility functions for Sentry error reporting
 */

/**
 * Captures a message to Sentry for logging
 * @param message Message to capture
 * @param options Additional options
 */
export function captureMessage(message: string, options: any = {}) {
  console.log(`[${options?.level || 'info'}] ${message}`);
}

/**
 * Captures an error to Sentry for logging
 * @param error Error to capture
 * @param options Additional options
 */
export function captureError(error: Error | string, options: any = {}) {
  const errorMessage = error instanceof Error ? error.message : error;
  console.error(`[error] ${errorMessage}`, options);
}

/**
 * Reports a captured transaction to Sentry
 * @param transaction Transaction to report
 */
export function reportTransaction(transaction: any) {
  console.log(`[transaction] ${transaction?.name || 'unknown'}`);
}
