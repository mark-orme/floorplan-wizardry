
/**
 * Utility functions for input sanitization
 */

/**
 * Sanitizes HTML content from user input
 * @param input String to sanitize
 * @returns Sanitized string with HTML tags removed
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Strips JavaScript events from HTML content
 * @param input String to sanitize
 * @returns Sanitized string with JavaScript events removed
 */
export function stripJavaScriptEvents(input: string): string {
  if (!input) return '';
  return input.replace(/on\w+="[^"]*"/g, '');
}

/**
 * Sanitizes an object's string properties
 * @param obj Object to sanitize
 * @returns New object with sanitized string properties
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
