/**
 * Input Sanitization Utilities
 * Provides functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes HTML content by removing potentially malicious tags and attributes
 * @param html HTML content to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  // Simple implementation that removes all HTML tags
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Strips JavaScript event handlers from HTML content
 * @param html HTML content to process
 * @returns HTML string with JavaScript events removed
 */
export function stripJavaScriptEvents(html: string): string {
  // Remove common JavaScript event handlers
  return html.replace(/on\w+="[^"]*"/g, '');
}

/**
 * Sanitizes a URL to prevent javascript: protocol and similar attacks
 * @param url URL to sanitize
 * @returns Sanitized URL string
 */
export function sanitizeUrl(url: string): string {
  // Remove javascript: protocol and other potentially dangerous URLs
  if (!url) return '';
  
  const sanitized = url.trim().toLowerCase();
  
  if (sanitized.startsWith('javascript:') || 
      sanitized.startsWith('data:') ||
      sanitized.startsWith('vbscript:')) {
    return '';
  }
  
  return url;
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param text Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes file name to prevent path traversal attacks
 * @param fileName File name to sanitize
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
  // Remove any directory traversal attempts and dangerous characters
  return fileName
    .replace(/\.\.\//g, '')
    .replace(/\//g, '')
    .replace(/\\/g, '')
    .replace(/:/g, '')
    .replace(/\*/g, '')
    .replace(/\?/g, '')
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/\|/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '');
}

/**
 * Sanitizes SQL input to prevent SQL injection
 * Note: This is a basic implementation and not a replacement for parameterized queries
 * @param input SQL input to sanitize
 * @returns Sanitized input
 */
export function sanitizeSql(input: string): string {
  // Basic SQL injection prevention
  return input
    .replace(/'/g, "''")
    .replace(/--/g, "")
    .replace(/;/g, "");
}

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
};
