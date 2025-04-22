/**
 * Input sanitization utilities
 * Provides methods to sanitize user input and prevent XSS attacks
 */

/**
 * Sanitize HTML strings to prevent XSS attacks
 * @param html HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Basic sanitization - replace potentially dangerous characters
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize all string values in an object recursively
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        result[key] = sanitizeHtml(value);
      } else if (value === null || value === undefined) {
        result[key] = value;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeObject(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map(item => 
          typeof item === 'string' 
            ? sanitizeHtml(item) 
            : (typeof item === 'object' ? sanitizeObject(item) : item)
        );
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
};

/**
 * Validate and sanitize email addresses
 * @param email Email to validate and sanitize
 * @returns Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return '';
  }
  
  return sanitizeHtml(email);
};

/**
 * Sanitize URL strings to prevent XSS via javascript: or data: URLs
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string if potentially dangerous
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  
  // Check for javascript: or data: URLs (potential XSS vectors)
  if (/^(javascript|data|vbscript):/i.test(trimmedUrl)) {
    return '';
  }
  
  // For relative URLs, keep as is
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
    return trimmedUrl;
  }
  
  // For absolute URLs, ensure they start with http:// or https://
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }
  
  // If it doesn't match any of the above patterns, prepend https://
  return `https://${trimmedUrl}`;
};

/**
 * Export all sanitization functions
 */
export default {
  sanitizeHtml,
  sanitizeObject,
  sanitizeEmail,
  sanitizeUrl
};
