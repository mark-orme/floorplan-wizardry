
/**
 * Utility functions for error handling and null checks
 */

/**
 * Safely invoke a function that might be undefined
 * @param fn Function to call
 * @param args Arguments to pass
 * @returns Result of the function or undefined
 */
export function safeInvoke<T, R>(
  fn: ((arg: T) => R) | undefined, 
  arg: T
): R | undefined {
  return fn ? fn(arg) : undefined;
}

/**
 * Safely access a property that might be undefined
 * @param obj Object to access
 * @param prop Property to access
 * @returns Property value or undefined
 */
export function safeAccess<T, K extends keyof T>(
  obj: T | null | undefined, 
  prop: K
): T[K] | undefined {
  return obj ? obj[prop] : undefined;
}

/**
 * Safely cast an unknown error to a string message
 * @param error The error object
 * @returns Error message as string
 */
export function errorToString(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred';
  }
}

/**
 * Handle an unknown error with a callback
 * @param error The error object
 * @param handler Error handler function
 */
export function handleUnknownError(
  error: unknown, 
  handler: (message: string) => void
): void {
  handler(errorToString(error));
}

/**
 * Handle API error (for component error handling)
 * @param error The error object
 * @param callback Optional callback for error handling
 * @returns Normalized error message
 */
export function handleApiError(
  error: unknown,
  callback?: (message: string) => void
): string {
  const message = errorToString(error);
  if (callback) {
    callback(message);
  }
  return message;
}

/**
 * Convert unknown to Error object
 * @param error Unknown error object
 * @returns Error instance
 */
export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  } else if (typeof error === 'string') {
    return new Error(error);
  } else {
    return new Error('Unknown error');
  }
}

