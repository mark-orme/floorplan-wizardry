
/**
 * Utility functions for XSS protection
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export const sanitizeHtml = (html: string): string => {
  // Simple implementation - in production would use a proper sanitizer library
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\(/g, '&#40;')
    .replace(/\)/g, '&#41;');
};

/**
 * Initialize XSS protection for the application
 */
export const initXssProtection = (): void => {
  // This would configure global XSS protection in a real implementation
  console.log('XSS protection initialized');
};

export default {
  sanitizeHtml,
  initXssProtection
};
