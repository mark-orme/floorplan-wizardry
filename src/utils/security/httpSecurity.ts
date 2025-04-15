
/**
 * HTTP Security Utilities
 * Functions for securing HTTP requests and responses
 */

import { getCsrfToken } from './csrfProtection';
import logger from '@/utils/logger';

/**
 * Apply security related meta tags to document head
 */
export function applySecurityMetaTags(): void {
  if (typeof document === 'undefined') return;
  
  const metaTags = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { name: 'referrer', content: 'no-referrer' }
    // X-Frame-Options and HSTS should be set via actual HTTP headers, not meta tags
  ];
  
  metaTags.forEach(tagInfo => {
    const existingTag = tagInfo.httpEquiv 
      ? document.querySelector(`meta[http-equiv="${tagInfo.httpEquiv}"]`)
      : document.querySelector(`meta[name="${tagInfo.name}"]`);
    
    if (!existingTag) {
      const meta = document.createElement('meta');
      if (tagInfo.httpEquiv) meta.httpEquiv = tagInfo.httpEquiv;
      if (tagInfo.name) meta.name = tagInfo.name;
      meta.content = tagInfo.content;
      document.head.appendChild(meta);
    }
  });
}

/**
 * Check if the current connection is secure (HTTPS or localhost)
 */
export function isConnectionSecure(): boolean {
  if (typeof window === 'undefined') return true;
  
  return window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';
}

/**
 * Add security headers to fetch options
 * @param options Original fetch options
 * @returns Fetch options with security headers
 */
export function addSecurityHeaders(options: RequestInit = {}): RequestInit {
  const secureOptions = { ...options };
  secureOptions.headers = secureOptions.headers || {};
  
  // Convert different header formats to a Headers object
  let headers: Headers;
  if (secureOptions.headers instanceof Headers) {
    headers = secureOptions.headers;
  } else if (Array.isArray(secureOptions.headers)) {
    headers = new Headers();
    secureOptions.headers.forEach(([key, value]) => {
      headers.append(key, value);
    });
  } else {
    headers = new Headers(secureOptions.headers);
  }
  
  // Add security headers
  headers.append('X-Content-Type-Options', 'nosniff');
  
  // Add CSRF token if available
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers.append('X-CSRF-Token', csrfToken);
  }
  
  secureOptions.headers = headers;
  return secureOptions;
}

/**
 * Secure fetch wrapper with additional security headers
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Fetch promise
 */
export function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Check if URL is secure
  if (url.startsWith('http:') && isConnectionSecure()) {
    logger.warn('Secure application attempting to load insecure resource:', { url });
  }
  
  // Add security headers
  const secureOptions = addSecurityHeaders(options);
  
  // Perform fetch with enhanced security
  return fetch(url, secureOptions);
}
