
/**
 * Input Sanitization Utilities
 * Provides utilities for sanitizing user input
 * @module utils/security/inputSanitization
 */

/**
 * Sanitize input to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize an object's string properties recursively
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        result[key] = sanitizeHtml(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects and arrays
        result[key] = Array.isArray(value) 
          ? value.map(item => typeof item === 'object' && item !== null ? sanitizeObject(item) : item)
          : sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result as T;
}

/**
 * Sanitize a URL for safe usage
 * @param url URL to sanitize
 * @param allowedProtocols Allowed protocols
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string, allowedProtocols: string[] = ['http:', 'https:']): string | null {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Parse the URL
    const parsedUrl = new URL(url);
    
    // Check if protocol is allowed
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return null;
    }
    
    return parsedUrl.toString();
  } catch (error) {
    // Invalid URL
    return null;
  }
}

/**
 * Strip JavaScript event handlers from a string
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function stripJavaScriptEvents(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove common JS event handlers
  return input.replace(/on\w+(\s*)=(\s*)['"](.*?)['"]/g, '');
}

/**
 * Remove JavaScript from CSS to prevent CSS-based attacks
 * @param css CSS string to sanitize
 * @returns Sanitized CSS
 */
export function sanitizeCSS(css: string): string {
  if (!css || typeof css !== 'string') return '';
  
  // Remove potentially dangerous CSS constructs
  return css
    .replace(/expression\s*\(.*\)/g, '') // Remove CSS expressions
    .replace(/@import/g, '') // Remove imports
    .replace(/javascript:/g, '') // Remove javascript: protocol
    .replace(/behavior:/g, '') // Remove behavior
    .replace(/binding:/g, '') // Remove binding
    .replace(/-moz-binding:/g, ''); // Remove Mozilla binding
}

/**
 * Create a safe display name from user input
 * @param input User input for display name
 * @returns Sanitized display name
 */
export function createSafeDisplayName(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML, limit length, and only allow certain characters
  return sanitizeHtml(input)
    .trim()
    .replace(/[^\w\s.,'-]/g, '')
    .substring(0, 100);
}
