
/**
 * Sanitizes HTML strings to prevent XSS attacks
 * @param html HTML string to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(html: string): string {
  // Simple sanitization for demonstration
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}
