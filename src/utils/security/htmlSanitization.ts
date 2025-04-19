
/**
 * HTML Sanitization Utilities
 * Provides functions to safely sanitize user input and prevent XSS attacks
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param html The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (typeof DOMPurify === 'undefined') {
    console.warn('DOMPurify is not available. Running in a non-browser environment?');
    // Fallback: strip all HTML tags
    return html.replace(/<[^>]*>?/gm, '');
  }
  
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
}

/**
 * Sanitize a plain text input
 * @param text The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  
  // Encode HTML entities
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize an object by sanitizing all string values
 * @param obj The object to sanitize
 * @returns A new object with sanitized values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = {} as T;
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        result[key] = sanitizeText(value) as any;
      } else if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}
