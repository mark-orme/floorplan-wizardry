
import DOMPurify from 'dompurify';

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
    if (link instanceof Element) {
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('target', '_blank');
    }
  });
}
