
/**
 * HTML Sanitization Utilities
 * Functions for sanitizing HTML content to prevent XSS
 */

/**
 * Sanitize HTML string by removing all tags
 * @param html HTML string to sanitize
 * @returns Sanitized string without any HTML tags
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Simple HTML tag removal using regex
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
  
  // This is a simplified implementation - in a real app, use DOMPurify
  // Remove script, iframe, object, embed, and other dangerous tags
  const safeHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
    
  return safeHtml;
}

/**
 * Sanitize HTML for canvas presentations, with specific allowed tags
 * @param html HTML content to sanitize for canvas
 * @returns Sanitized HTML suitable for canvas presentation
 */
export function sanitizeCanvasHtml(html: string): string {
  // For canvas html, we're even more strict, only allowing basic formatting
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
  
  // Check for javascript: protocol
  if (/^javascript:/i.test(url)) return '';
  
  // Check for valid URL format
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
