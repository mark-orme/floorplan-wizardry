
import { toast } from 'sonner';

/**
 * Normalize any error into a proper Error object
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(typeof error === 'string' ? error : 'Unknown error occurred');
}

/**
 * Show a toast error notification
 */
export function showErrorToast(message: string): void {
  toast.error(message);
}

/**
 * Handle API error responses
 */
export function handleApiError(error: unknown, defaultMessage = 'An error occurred'): void {
  const normalizedError = normalizeError(error);
  console.error('API Error:', normalizedError);
  
  // Extract message or use default
  const errorMessage = normalizedError.message || defaultMessage;
  showErrorToast(errorMessage);
}
