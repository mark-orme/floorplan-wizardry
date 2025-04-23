
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
 * Sanitizes HTML content but preserves some basic formatting tags (b, i, etc)
 * @param input String to sanitize allowing basic rich text
 * @returns Sanitized string with basic formatting preserved
 */
export function sanitizeRichHtml(input: string): string {
  if (!input) return '';
  
  // Allow only specific safe tags
  const safeTagsRegex = /<(?!\/?(b|i|strong|em|u|p|br|span|h[1-6]|ul|ol|li)\b)[^>]+>/gi;
  const sanitized = input.replace(safeTagsRegex, '');
  
  // Remove potentially harmful attributes
  return sanitized.replace(/(on\w+)="[^"]*"/g, '').replace(/javascript:/gi, '');
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

/**
 * Sanitizes HTML specifically for canvas text content
 * @param input HTML content to sanitize for canvas
 * @returns Sanitized HTML string safe for canvas
 */
export function sanitizeCanvasHtml(input: string): string {
  if (!input) return '';
  
  // Canvas text should be very strictly sanitized
  return sanitizeHtml(input);
}
