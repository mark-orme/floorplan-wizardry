
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
  if (!html || typeof html !== 'string') return '';
  
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
 * Sanitize HTML string but allow certain formatting tags
 * @param html The HTML string to sanitize
 * @returns Sanitized HTML string with allowed formatting
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  if (typeof DOMPurify === 'undefined') {
    console.warn('DOMPurify is not available. Running in a non-browser environment?');
    // Fallback: strip all HTML tags
    return html.replace(/<[^>]*>?/gm, '');
  }
  
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'title'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    ALLOW_DATA_ATTR: false
  });
}

/**
 * Sanitize HTML specifically for canvas element content
 * @param html The HTML string to sanitize for canvas
 * @returns Sanitized HTML string safe for canvas use
 */
export function sanitizeCanvasHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  if (typeof DOMPurify === 'undefined') {
    return html.replace(/<[^>]*>?/gm, '');
  }
  
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['span', 'div', 'p', 'br'],
    ALLOWED_ATTR: ['class', 'title'],
    ALLOW_DATA_ATTR: false
  });
}

/**
 * Sanitize CSS string to prevent style-based attacks
 * @param css The CSS string to sanitize
 * @returns Sanitized CSS string
 */
export function sanitizeCss(css: string): string {
  // Remove potentially dangerous CSS constructs
  return css
    .replace(/@import/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/url\s*\(/gi, 'url(')
    .replace(/-moz-binding/gi, '')
    .replace(/behavior\s*:/gi, '')
    .replace(/javascript\s*:/gi, '');
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

// Alias for backward compatibility
export const sanitizeHTML = sanitizeHtml;
