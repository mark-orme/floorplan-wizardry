
/**
 * Input Sanitization Utilities
 * Functions for sanitizing user input
 */

/**
 * Sanitize HTML string by removing all tags
 * @param input HTML string to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Strip JavaScript event handlers from HTML
 * @param input HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function stripJavaScriptEvents(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove JavaScript event handlers (onclick, onload, etc.)
  return input.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^>\s]*)/gi, '');
}

/**
 * Sanitize URL to prevent injection attacks
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // Only allow http:, https: and mailto: protocols
  if (!/^(https?|mailto):/i.test(url)) {
    return '';
  }
  
  // Remove any potentially harmful characters
  return url.replace(/[^\w:/?=#&%~.@!$'()*+,;[\]-]/gi, '');
}

/**
 * Sanitize an object's string properties recursively
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return {} as T;
  const sanitized = {} as T;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeHtml(value) as any;
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}
