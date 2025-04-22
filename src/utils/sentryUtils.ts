
/**
 * Sentry utilities
 * Provides backward compatible error reporting functions
 */

import { captureError as newCaptureError, captureMessage as newCaptureMessage } from '@/utils/sentry';

/**
 * Backward compatible captureError function
 * Converts old-style 3-argument calls to the new 2-argument format
 */
export function captureError(error: Error | unknown, contextOrType?: string | any, optionsOrData?: any) {
  // If using the old 3-arg pattern (error, type, data)
  if (typeof contextOrType === 'string' && optionsOrData !== undefined) {
    return newCaptureError(error, {
      context: { type: contextOrType, ...optionsOrData }
    });
  }
  
  // If using the new 2-arg pattern (error, context)
  return newCaptureError(error, contextOrType);
}

/**
 * Backward compatible captureMessage function
 * Converts old-style 3-argument calls to the new 2-argument format
 */
export function captureMessage(message: string, categoryOrLevel?: string | any, optionsOrData?: any) {
  // If using the old 3-arg pattern (message, category, data)
  if (typeof categoryOrLevel === 'string' && optionsOrData !== undefined) {
    return newCaptureMessage(message, {
      context: { category: categoryOrLevel, ...optionsOrData }
    });
  }
  
  // If using the new 2-arg pattern (message, context)
  return newCaptureMessage(message, categoryOrLevel);
}

// Re-export original functions for direct access
export { newCaptureError, newCaptureMessage };
