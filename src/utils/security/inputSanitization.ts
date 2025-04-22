
/**
 * Sanitize HTML string to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  // Simple sanitization (in production, use a library like DOMPurify)
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Sanitize object properties recursively
 */
export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key] = sanitizeHtml(value);
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => 
        typeof item === 'string' 
          ? sanitizeHtml(item)
          : (typeof item === 'object' && item !== null ? sanitizeObject(item) : item)
      );
    } else {
      result[key] = value;
    }
  });
  
  return result;
};
