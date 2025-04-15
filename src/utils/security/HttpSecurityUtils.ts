
/**
 * HTTP Security Utilities
 * Functions for securing HTTP connections and fetching
 */
import { getCsrfToken } from './csrfProtection';
import logger from '@/utils/logger';

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

/**
 * Apply security meta tags to document head
 * Note: X-Frame-Options cannot be set via meta tags, it must be sent as an HTTP header
 */
export function applySecurityMetaTags(): void {
  if (typeof window === 'undefined') return;
  
  // Remove any existing security meta tags
  const existingTags = document.querySelectorAll(
    'meta[http-equiv="Content-Security-Policy"], meta[http-equiv="X-Content-Type-Options"]'
  );
  existingTags.forEach(tag => tag.remove());
  
  // Add Content-Security-Policy meta tag
  const cspTag = document.createElement('meta');
  cspTag.httpEquiv = 'Content-Security-Policy';
  cspTag.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.pusher.com https://*.pusher.com; worker-src 'self' blob:;";
  document.head.appendChild(cspTag);
  
  // Add X-Content-Type-Options meta tag
  const xctoTag = document.createElement('meta');
  xctoTag.httpEquiv = 'X-Content-Type-Options';
  xctoTag.content = 'nosniff';
  document.head.appendChild(xctoTag);
  
  // X-Frame-Options cannot be set via meta tags, this must be done server-side
  logger.info('Security meta tags applied, X-Frame-Options must be set via HTTP headers');
}

/**
 * Get CSP headers for server-side implementation
 */
export function getCSPHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.lovable.dev https://*.lovable.dev https://*.sentry.io https://sentry.io https://api.sentry.io https://ingest.sentry.io wss://*.pusher.com https://*.pusher.com https://*.lovable.app ws: http://localhost:* http://*:* ws://*:*; frame-src 'self' https://*.lovable.dev https://*.lovable.app; object-src 'none'; base-uri 'self'; worker-src 'self' blob: 'unsafe-inline'; child-src 'self' blob:;",
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}
