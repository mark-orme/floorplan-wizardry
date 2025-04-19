
import DOMPurify from 'dompurify';

/**
 * Initialize DOMPurify for sanitization
 */
export function initializeDOMPurify(): void {
  // Nothing needed for browser environments as DOMPurify auto-initializes
  console.log('DOMPurify initialized');
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
}

/**
 * Alias for sanitizeHTML to maintain compatibility
 */
export const sanitizeHtml = sanitizeHTML;

/**
 * Sanitize HTML allowing rich text formatting
 * @param html HTML content to sanitize
 * @returns Sanitized HTML with allowed formatting
 */
export function sanitizeRichHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
}

/**
 * Sanitize HTML for canvas rendering
 * @param html HTML content to sanitize
 * @returns Sanitized HTML for canvas
 */
export function sanitizeCanvasHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
    ALLOWED_TAGS: ['span', 'b', 'i', 'em', 'strong', 'br'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
}

/**
 * Sanitize CSS content to prevent CSS-based attacks
 * @param css CSS content to sanitize
 * @returns Sanitized CSS
 */
export function sanitizeCss(css: string): string {
  // Basic CSS sanitization
  return css.replace(
    /(javascript|expression|eval|function|url|import)\s*:/gi,
    'invalid:'
  );
}

/**
 * Sanitize a URL to prevent malicious URLs
 * @param url URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Basic URL sanitization to prevent javascript: or data: URLs
  const sanitized = url.replace(/^(javascript|data|vbscript):/gi, 'invalid:');
  
  // Check if it's a valid URL format
  try {
    new URL(sanitized);
    return sanitized;
  } catch (e) {
    // If not a valid URL, return empty string
    return '';
  }
}

/**
 * Apply sanitized content to an element
 * @param element The DOM element to update
 * @param html The sanitized HTML content
 */
export function applySanitizedContent(element: Element, html: string): void {
  const sanitized = sanitizeHTML(html);
  element.innerHTML = sanitized;
  
  // Add safety attributes to all links
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    if (link instanceof HTMLElement) {
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('target', '_blank');
    }
  });
}
