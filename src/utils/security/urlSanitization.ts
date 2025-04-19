
/**
 * URL Sanitization Utilities
 * Functions for sanitizing URLs
 */

/**
 * Sanitize a URL to prevent attacks
 * @param url URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeURL(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  // Check for allowed protocols
  if (!/^(https?|ftp|file):\/\//i.test(url)) {
    return null;
  }
  
  // Try to parse URL
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

/**
 * Check if a URL is a safe relative URL
 * @param url URL to check
 * @returns Boolean indicating if the URL is safe
 */
export function isSafeRelativeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Must start with / but not with //
  if (!url.startsWith('/') || url.startsWith('//')) return false;
  
  // Check for any protocol indicators
  if (/^\/[^/]*:/.test(url)) return false;
  
  return true;
}

/**
 * Sanitize a URL parameter to prevent injection
 * @param param Parameter to sanitize
 * @returns Sanitized parameter
 */
export function sanitizeUrlParam(param: string): string {
  if (!param || typeof param !== 'string') return '';
  
  // Remove special characters and encode
  return encodeURIComponent(param.replace(/[^\w\s-]/g, ''));
}

/**
 * Verify that a URL belongs to the same origin
 * @param url URL to check
 * @returns Boolean indicating if the URL is same-origin
 */
export function isSameOrigin(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Handle relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) return true;
    
    const currentOrigin = window.location.origin;
    const urlObj = new URL(url);
    
    return urlObj.origin === currentOrigin;
  } catch {
    return false;
  }
}
