
/**
 * Content Security Policy Utilities
 * Provides CSP configuration and implementation
 */
import logger from '@/utils/logger';

// Define Content Security Policy directives
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline in production
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", "https://*.supabase.co", "wss://*.lovable.dev", "https://*.sentry.io"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * Build CSP string from directives
 * @returns Formatted CSP header value
 */
export function buildCSPString(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Apply CSP as meta tag in document head
 */
export function applyCSPMetaTag(): void {
  if (typeof document === 'undefined') return;
  
  // Check if CSP meta tag already exists
  if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    logger.info('CSP meta tag already exists');
    return;
  }
  
  try {
    // Create and append CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = buildCSPString();
    document.head.appendChild(cspMeta);
    
    logger.info('Content Security Policy applied via meta tag');
  } catch (error) {
    logger.error('Failed to apply CSP meta tag', { error });
  }
}

/**
 * Get CSP headers for server-side implementation
 * @returns Object with CSP headers
 */
export function getCSPHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': buildCSPString(),
  };
}

/**
 * Initialize Content Security Policy
 * Should be called during app initialization
 */
export function initializeCSP(): void {
  // Apply CSP as meta tag for client-side enforcement
  if (typeof window !== 'undefined') {
    applyCSPMetaTag();
  }
}
