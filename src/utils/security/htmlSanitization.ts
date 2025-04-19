
/**
 * HTML Sanitization Utilities
 * Provides functions for securely sanitizing HTML content
 */

import DOMPurify from 'dompurify';
import logger from '@/utils/logger';

/**
 * Initialize DOMPurify with secure configurations
 * This function should be called once when the application starts
 */
export function initializeDOMPurify(): void {
  if (typeof window === 'undefined') return;
  
  // Configure DOMPurify with secure defaults
  DOMPurify.setConfig({
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed', 'link'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onkeydown', 'onkeypress', 'onkeyup', 'formaction'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true },
    SANITIZE_DOM: true
  });
  
  // Add hooks for additional security
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    if (node.nodeName && node.nodeName.toLowerCase() === 'a') {
      // Force all links to open in a new tab and add noopener/noreferrer
      if ('setAttribute' in node) {
        (node as Element).setAttribute('target', '_blank');
        (node as Element).setAttribute('rel', 'noopener noreferrer');
      }
    }
    return node;
  });
  
  logger.info('DOMPurify initialized with secure configurations');
}

/**
 * Completely sanitize HTML by removing all tags
 * Use this for user-generated content that should never contain HTML
 * @param html HTML string to sanitize
 * @returns Plain text with all HTML removed
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  try {
    // Remove all HTML tags entirely
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  } catch (error) {
    logger.error('Error sanitizing HTML', { error });
    return '';
  }
}

/**
 * Sanitize CSS content to prevent CSS-based attacks
 * @param css CSS string to sanitize
 * @returns Sanitized CSS string
 */
export function sanitizeCss(css: string): string {
  if (!css || typeof css !== 'string') return '';
  
  try {
    // Remove potentially dangerous CSS constructs
    return css
      // Remove JavaScript URLs
      .replace(/url\s*\(\s*javascript:/gi, 'url(data:text/plain,blocked-javascript:')
      // Remove behavior property
      .replace(/behavior\s*:/gi, 'no-behavior:')
      // Remove expression, eval, and other JavaScript functions
      .replace(/(expression|eval|function|alert|document)\s*\(/gi, 'no-js(')
      // Replace @import with a comment
      .replace(/@import/gi, '/* @import blocked */')
      // Block any HTML comment tags (which could hide malicious code)
      .replace(/<!--/g, '/* ')
      .replace(/-->/g, ' */');
  } catch (error) {
    logger.error('Error sanitizing CSS', { error });
    return '';
  }
}

/**
 * Sanitize HTML but allow a safe subset of tags
 * Use this for rich text content that needs some formatting
 * @param html HTML string to sanitize
 * @returns Sanitized HTML with only safe tags and attributes
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  if (typeof window === 'undefined') return sanitizeHtml(html);
  
  try {
    // Use DOMPurify for rich HTML sanitization
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'p', 'br', 'span', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
  } catch (error) {
    logger.error('Error sanitizing rich HTML', { error });
    return sanitizeHtml(html); // Fallback to complete sanitization
  }
}

/**
 * Sanitize HTML for display in a canvas or SVG context
 * Special case for fabric.js or similar libraries
 * @param html HTML string to sanitize
 * @returns Sanitized HTML safe for canvas/SVG context
 */
export function sanitizeCanvasHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  if (typeof window === 'undefined') return sanitizeHtml(html);
  
  try {
    // More permissive for canvas contexts but still secure
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'p', 'br', 'span', 'strong', 'em'],
      ALLOWED_ATTR: ['class', 'style'],
      ADD_ATTR: ['xmlns', 'xmlns:xlink'],
      ADD_TAGS: ['svg', 'g', 'path', 'rect', 'circle', 'text', 'tspan']
    });
  } catch (error) {
    logger.error('Error sanitizing canvas HTML', { error });
    return sanitizeHtml(html); // Fallback to complete sanitization
  }
}

/**
 * Sanitize a URL to prevent javascript: and data: URLs
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // Trim the URL
  const trimmedUrl = url.trim();
  
  // Check for dangerous protocols
  const dangerous = /^(?:javascript|data|vbscript|file):/i;
  if (dangerous.test(trimmedUrl)) {
    logger.warn('Dangerous URL detected and blocked', { url: trimmedUrl });
    return '';
  }
  
  // Only allow http:, https:, mailto:, tel:
  if (/^(?:https?|mailto|tel):/i.test(trimmedUrl)) {
    return trimmedUrl;
  }
  
  // If no protocol is specified, assume http
  if (!/^[a-z]+:/i.test(trimmedUrl) && trimmedUrl.length > 0) {
    return `https://${trimmedUrl}`;
  }
  
  // Block any other protocols
  return '';
}
