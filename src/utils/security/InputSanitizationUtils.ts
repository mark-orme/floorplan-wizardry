
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - Raw HTML content
 * @returns Sanitized HTML
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    USE_PROFILES: { html: true }
  });
};

/**
 * Sanitize a plain text string (removes all HTML)
 * @param text - Raw text input
 * @returns Plain text with HTML removed
 */
export const sanitizeText = (text: string): string => {
  return text.replace(/<[^>]*>?/gm, '');
};

/**
 * Sanitize and escape text for safe insertion into HTML
 * @param text - Raw text to be displayed in HTML
 * @returns HTML-escaped text
 */
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Sanitize an object's string properties
 * @param obj - Object with potentially unsafe string values
 * @returns Object with sanitized string values
 */
export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeHtml(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Remove JavaScript event handlers from HTML string
 * @param html - Raw HTML string
 * @returns HTML without on* event attributes
 */
export function stripJavaScriptEvents(input: string): string {
  return input.replace(/\s+on\w+="[^"]*"/gi, '');
}
