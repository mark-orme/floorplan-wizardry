
/**
 * HTTP Security Utilities
 * Functions for securing HTTP requests and responses
 */
import { getCsrfToken, generateCSRFToken } from './csrfProtection';

/**
 * Secure fetch wrapper that adds security headers
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with fetch response
 */
export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Sanitize URL
  const sanitizedUrl = sanitizeURL(url);
  if (!sanitizedUrl) {
    throw new Error('Invalid URL');
  }
  
  // Add security headers
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-CSRF-Token': getCsrfToken()
  };
  
  const mergedHeaders = {
    ...securityHeaders,
    ...(options.headers || {})
  };
  
  // Perform fetch with security headers
  return fetch(sanitizedUrl, {
    ...options,
    headers: mergedHeaders
  });
}

/**
 * Simple URL sanitization
 * @param url URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
function sanitizeURL(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  // Check for basic protocols
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
 * Adds security headers to a request object
 * @param headers Existing headers
 * @returns Headers with security additions
 */
export function addSecurityHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-CSRF-Token': generateCSRFToken()
  };
}

/**
 * Creates a safe redirect URL
 * @param url URL to redirect to
 * @param defaultUrl Default URL if the provided one is unsafe
 * @returns Safe URL to redirect to
 */
export function createSafeRedirect(url: string, defaultUrl: string = '/'): string {
  if (!url || typeof url !== 'string') return defaultUrl;
  
  // Only allow relative URLs or URLs to the same domain
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }
  
  try {
    const urlObj = new URL(url);
    const currentDomain = window.location.hostname;
    
    // Check if URL is for the same domain
    if (urlObj.hostname === currentDomain) {
      return url;
    }
  } catch {
    // Invalid URL, return default
  }
  
  return defaultUrl;
}
