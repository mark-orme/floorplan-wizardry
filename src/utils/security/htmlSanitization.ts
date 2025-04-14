
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
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
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
 * Sanitize CSS to prevent CSS-based injection attacks
 * @param css CSS string to sanitize
 * @returns Sanitized CSS string
 */
export function sanitizeCss(css: string): string {
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
