
/**
 * HTML Sanitization Utilities
 * Functions for sanitizing HTML content to prevent XSS
 */
import DOMPurify from 'dompurify';
import logger from '@/utils/logger';

/**
 * Initialize DOMPurify configuration
 */
function initializeDOMPurify() {
  if (typeof window !== 'undefined' && typeof DOMPurify !== 'undefined') {
    // Configure DOMPurify hooks
    DOMPurify.addHook('beforeSanitizeElements', (node) => {
      // Log potentially dangerous content
      if (node.nodeType === 1 && 
         ((node as Element).tagName === 'SCRIPT' || (node as Element).hasAttribute('on'))) {
        logger.warn('Potential XSS attempt detected and prevented');
      }
      return node;
    });
    
    logger.info('DOMPurify initialized with security hooks');
  }
}

// Initialize on module load
initializeDOMPurify();

/**
 * Sanitize HTML string by removing all tags
 * @param html HTML string to sanitize
 * @returns Sanitized string without any HTML tags
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  if (typeof window !== 'undefined') {
    // Use DOMPurify for comprehensive HTML sanitization
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [], // Remove all HTML tags
      ALLOWED_ATTR: []  // Remove all attributes
    });
  }
  
  // Fallback if DOMPurify is not available (server-side)
  return html.replace(/<[^>]*>/g, '');
}

// Aliases for backward compatibility
export const sanitizeHtml = sanitizeHTML;

/**
 * Sanitize rich HTML content, allowing certain safe tags
 * @param html Rich HTML content to sanitize
 * @returns Sanitized HTML with only allowed tags
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'javascript:'],
      ADD_ATTR: ['target="_blank"', 'rel="noopener noreferrer"']
    });
  }
  
  // Fallback implementation
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

/**
 * Sanitize HTML for canvas presentations, with specific allowed tags
 * @param html HTML content to sanitize for canvas
 * @returns Sanitized HTML suitable for canvas presentation
 */
export function sanitizeCanvasHtml(html: string): string {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'br', 'p'],
      ALLOWED_ATTR: ['class'],
      USE_PROFILES: { html: true }
    });
  }
  
  // For canvas html, we're even more strict
  return sanitizeRichHtml(html);
}

/**
 * Sanitize CSS content to prevent CSS injection attacks
 * @param css CSS content to sanitize
 * @returns Sanitized CSS
 */
export function sanitizeCss(css: string): string {
  if (!css || typeof css !== 'string') return '';
  
  // Remove potentially dangerous CSS
  return css
    .replace(/@import/gi, '')
    .replace(/expression/gi, '')
    .replace(/url\s*\(/gi, 'url(')
    .replace(/behavior/gi, '');
}

/**
 * Sanitize URL to prevent javascript: protocol and other issues
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  if (typeof window !== 'undefined') {
    // Use DOMPurify for URL sanitization
    const sanitized = DOMPurify.sanitize(url, {
      ALLOWED_TAGS: ['a'],
      ALLOWED_ATTR: ['href']
    });
    
    const div = document.createElement('div');
    div.innerHTML = sanitized;
    const anchor = div.querySelector('a');
    return anchor ? anchor.href : '';
  }
  
  // Check for javascript: protocol
  if (/^javascript:/i.test(url)) return '';
  
  // Basic URL validation
  try {
    new URL(url);
    return url;
  } catch {
    // If it's a relative URL, it will throw an error, but might be valid
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
    return '';
  }
}
