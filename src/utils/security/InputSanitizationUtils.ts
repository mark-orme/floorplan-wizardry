
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param input - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed'],
    USE_PROFILES: { html: true }
  });
};

/**
 * Sanitize a plain text input
 * @param input - Text to sanitize
 * @returns Sanitized text string
 */
export const sanitizeText = (input: string): string => {
  // First remove HTML tags completely
  const noHtml = input.replace(/<[^>]*>?/gm, '');
  
  // Then escape special characters
  return noHtml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Sanitize user input for use in SQL queries
 * @param input - Input string to sanitize
 * @returns Sanitized string safe for SQL
 */
export const sanitizeSqlInput = (input: string): string => {
  // Remove SQL injection patterns
  return input.replace(/['";\\%]/g, '');
};

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Boolean indicating if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format and ensure it uses http or https
 * @param url - URL to validate
 * @returns Boolean indicating if URL format is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
};
