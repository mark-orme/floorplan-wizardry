
/**
 * Canvas type debugger for Sentry
 * Validates canvas objects and reports issues to Sentry
 */
import * as Sentry from '@sentry/react';

/**
 * Validate a fabric canvas object
 * @param canvas Canvas to validate
 * @returns Validation result
 */
export function validateCanvasType(canvas: any): { valid: boolean; errors: string[] } {
  // Check if canvas exists
  if (!canvas) {
    return { valid: false, errors: ['Canvas is undefined'] };
  }
  
  const errors: string[] = [];
  
  // Check for required methods
  const requiredMethods = ['add', 'remove', 'getObjects', 'renderAll'];
  for (const method of requiredMethods) {
    if (typeof canvas[method] !== 'function') {
      errors.push(`Canvas is missing required method: ${method}`);
    }
  }
  
  return { 
    valid: errors.length === 0,
    errors 
  };
}

/**
 * Report canvas type validation issues to Sentry
 * @param canvas Canvas to validate
 */
export function reportCanvasTypeIssues(canvas: any): void {
  const result = validateCanvasType(canvas);
  
  if (!result.valid) {
    Sentry.captureMessage(`Canvas type validation failed: ${result.errors.join(', ')}`, {
      level: 'warning',
      tags: {
        component: 'canvas',
        validation: 'type-error'
      }
    });
  }
}
