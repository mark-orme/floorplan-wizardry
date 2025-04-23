/**
 * HTML sanitization utilities
 * Provides functions to sanitize HTML and protect against XSS
 */
import { type Node } from 'node';

/**
 * Sanitizes HTML content by completely removing all HTML tags
 * @param html - HTML string to sanitize
 * @returns Plain text with all HTML tags removed
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Remove all HTML tags and decode HTML entities
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || '';
};

/**
 * Sanitizes HTML content by allowing only a limited set of safe tags
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML with only allowed tags
 */
export const sanitizeRichHtml = (html: string): string => {
  if (!html) return '';
  
  // In a real implementation, this would use DOMPurify or a similar library
  // For our mock implementation, we'll just use a simple regex to keep basic tags
  const allowedTags = ['p', 'b', 'i', 'em', 'strong', 'u', 'ul', 'ol', 'li', 'br', 'span'];
  
  // Create a simple regex pattern to match allowed tags
  const tagPattern = allowedTags.join('|');
  const regex = new RegExp(`<(?!\/?(?:${tagPattern})(?:\\s|>|$))[^>]*>`, 'gi');
  
  // Replace disallowed tags with empty string
  return html.replace(regex, '');
};

/**
 * Checks if string contains suspicious XSS patterns
 * @param value - String to check
 * @returns Whether the string contains suspicious patterns
 */
export const containsXssPatterns = (value: string): boolean => {
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript\s*:/gi,
    /on\w+\s*=/gi,
    /data\s*:/gi
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(value));
};
