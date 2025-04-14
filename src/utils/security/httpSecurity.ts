
/**
 * HTTP Security Utilities
 * Provides utilities for secure HTTP interactions
 * @module utils/security/httpSecurity
 */

import { addCSRFHeader } from './csrfProtection';

/**
 * Security headers to apply to HTTP responses
 * These are primarily useful for reference, as they should be set on the server
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://*.supabase.co; " +
    "frame-src 'none'; " +
    "object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

/**
 * Apply frontend security headers using meta tags
 * Only useful as a fallback or for static hosting
 */
export function applySecurityMetaTags(): void {
  if (typeof document === 'undefined') return;
  
  // Apply CSP as meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = SECURITY_HEADERS['Content-Security-Policy'];
  document.head.appendChild(cspMeta);
  
  // Apply other security headers as meta tags
  const securityMetaTags = [
    { httpEquiv: 'X-Content-Type-Options', content: SECURITY_HEADERS['X-Content-Type-Options'] },
    { httpEquiv: 'X-Frame-Options', content: SECURITY_HEADERS['X-Frame-Options'] },
    { httpEquiv: 'X-XSS-Protection', content: SECURITY_HEADERS['X-XSS-Protection'] },
    { httpEquiv: 'Referrer-Policy', content: SECURITY_HEADERS['Referrer-Policy'] }
  ];
  
  securityMetaTags.forEach(({ httpEquiv, content }) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = httpEquiv;
    meta.content = content;
    document.head.appendChild(meta);
  });
}

/**
 * Convert different header types to a unified Headers object
 * @param headers Headers in any supported format
 * @returns Standardized Headers object
 */
function normalizeHeaders(headers: HeadersInit | Record<string, string> | undefined): Headers {
  const result = new Headers();
  
  if (!headers) return result;
  
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result.append(key, value);
    });
  } else if (Array.isArray(headers)) {
    // Handle [string, string][] format
    headers.forEach(([key, value]) => {
      result.append(key, value);
    });
  } else {
    // Handle Record<string, string> format
    Object.entries(headers).forEach(([key, value]) => {
      result.append(key, value);
    });
  }
  
  return result;
}

/**
 * Create a fetch request with security headers
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with response
 */
export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Start with CSRF protection
  const csrfHeaders = addCSRFHeader(options.headers || {});
  const headers = normalizeHeaders(csrfHeaders);
  
  // Create secure options with proper type
  const secureOptions: RequestInit = {
    ...options,
    credentials: 'include' as RequestCredentials, // Type-safe credentials
    headers
  };
  
  // Check if we need to add content type
  if (secureOptions.method?.toUpperCase() !== 'GET' && 
      secureOptions.body && 
      !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  return fetch(url, secureOptions);
}

/**
 * Validate origin of request to prevent CSRF
 * @param origin Origin of request
 * @param allowedOrigins List of allowed origins
 * @returns Whether origin is valid
 */
export function validateOrigin(origin: string | null, allowedOrigins: string[] = []): boolean {
  if (!origin) return false;
  
  // Always allow same origin
  if (typeof window !== 'undefined' && origin === window.location.origin) {
    return true;
  }
  
  // Check against allowed origins
  return allowedOrigins.some(allowed => {
    if (allowed.endsWith('*')) {
      // Wildcard domain matching
      const prefix = allowed.slice(0, -1);
      return origin.startsWith(prefix);
    }
    return allowed === origin;
  });
}

/**
 * Create a secure URL with validation
 * @param url URL to validate
 * @param baseUrl Base URL to use for relative URLs
 * @returns Sanitized absolute URL or null if invalid
 */
export function createSecureUrl(url: string, baseUrl?: string): string | null {
  if (!url) return null;
  
  try {
    // Resolve relative URLs if base URL is provided
    const resolvedUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
    
    // Only allow http and https protocols
    if (resolvedUrl.protocol !== 'http:' && resolvedUrl.protocol !== 'https:') {
      return null;
    }
    
    // Return the secured URL
    return resolvedUrl.toString();
  } catch (error) {
    console.error('Invalid URL:', url);
    return null;
  }
}
