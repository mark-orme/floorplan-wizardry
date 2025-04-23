
/**
 * HTML sanitization utilities
 */

/**
 * Sanitizes HTML content to prevent XSS
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Sanitizes a URL to prevent security issues
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Only allow http, https, and relative URLs
  if (url.match(/^(https?:\/\/|\/)/)) {
    return url;
  }
  
  // Remove javascript: protocol and other harmful protocols
  if (url.match(/^(javascript|data|vbscript|file):/i)) {
    return '';
  }
  
  // Add https for URLs without protocol
  if (url.match(/^www\./)) {
    return `https://${url}`;
  }
  
  return '';
}

/**
 * Escapes special HTML characters to prevent XSS
 * @param text Text to escape
 * @returns Escaped text safe for HTML insertion
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
