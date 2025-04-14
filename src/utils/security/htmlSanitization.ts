
/**
 * HTML Sanitization Utilities
 * Provides secure HTML sanitization using DOMPurify
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS
 * @param html HTML content to sanitize
 * @param allowedTags Optional array of allowed HTML tags
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [],  // Strip all HTML tags by default
    ALLOWED_ATTR: []   // Strip all attributes
  });
}

/**
 * Sanitize HTML allowing specific safe tags
 * @param html HTML string to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout'],
    ADD_ATTR: ['target="_blank"', 'rel="noopener noreferrer"']
  });
}

/**
 * Sanitize HTML for canvas annotations or tooltips
 * @param html HTML content for tooltips or annotations
 * @returns Sanitized HTML string
 */
export function sanitizeCanvasHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'div', 'p', 'br'],
    ALLOWED_ATTR: ['style', 'class', 'id', 'data-*'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress']
  });
}

/**
 * Add CSP meta tag to document head
 * Sets up Content Security Policy through meta tag
 */
export function addCSPMetaTag(): void {
  if (typeof document === 'undefined') return;
  
  // Check if CSP meta tag already exists
  if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    return;
  }
  
  // Create CSP meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "default-src 'self'; img-src *; script-src 'self'; style-src 'self' 'unsafe-inline';";
  document.head.appendChild(cspMeta);
  
  // Create frame-ancestors restriction (prevent clickjacking)
  const frameAncestorsMeta = document.createElement('meta');
  frameAncestorsMeta.httpEquiv = 'Content-Security-Policy';
  frameAncestorsMeta.content = "frame-ancestors 'none';";
  document.head.appendChild(frameAncestorsMeta);
}
