
/**
 * Content Security Policy Utilities
 * Provides CSP configuration and implementation
 */
import logger from '@/utils/logger';

// Define Content Security Policy directives for production
export const PRODUCTION_CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'strict-dynamic'", "'nonce-{NONCE}'"], 
  'style-src': ["'self'", "'unsafe-inline'"], // Unsafe-inline needed for shadcn/ui
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", "https://*.supabase.co", "wss://*.lovable.dev", "https://*.sentry.io"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
  'require-trusted-types-for': ["'script'"],
  'trusted-types': ["'none'"], 
  'sandbox': ['allow-forms', 'allow-scripts', 'allow-same-origin'],
};

// Define Content Security Policy directives for development (less strict)
export const DEVELOPMENT_CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline scripts and eval in dev
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", "https://*.supabase.co", "wss://*.lovable.dev", "https://*.sentry.io", "ws:", "http://localhost:*"],
  'frame-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
};

/**
 * Build CSP string from directives
 * @param isProduction Whether to use production CSP directives
 * @returns Formatted CSP header value
 */
export function buildCSPString(isProduction = true): string {
  const directives = isProduction ? PRODUCTION_CSP_DIRECTIVES : DEVELOPMENT_CSP_DIRECTIVES;
  
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Generate a random nonce for CSP
 * @returns Random nonce string
 */
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Apply CSP as meta tag in document head
 * @param isProduction Whether to use production CSP directives
 */
export function applyCSPMetaTag(isProduction = process.env.NODE_ENV === 'production'): void {
  if (typeof document === 'undefined') return;
  
  try {
    // Remove any existing CSP meta tags to prevent duplication
    const existingCspTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    existingCspTags.forEach(tag => tag.remove());
    
    // Generate nonce for scripts if in production
    const nonce = isProduction ? generateCSPNonce() : '';
    
    // Create and apply CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    
    // Build CSP content with nonce if in production
    let cspContent = buildCSPString(isProduction);
    if (isProduction && nonce) {
      cspContent = cspContent.replace('{NONCE}', nonce);
      
      // Store nonce on window for script tags
      (window as any).__CSP_NONCE__ = nonce;
    }
    
    cspMeta.content = cspContent;
    document.head.appendChild(cspMeta);
    
    logger.info('Content Security Policy applied via meta tag');
  } catch (error) {
    logger.error('Failed to apply CSP meta tag', { error });
  }
}

/**
 * Get CSP headers for server-side implementation
 * @param isProduction Whether to use production CSP directives
 * @returns Object with CSP headers
 */
export function getCSPHeaders(isProduction = process.env.NODE_ENV === 'production'): Record<string, string> {
  return {
    'Content-Security-Policy': buildCSPString(isProduction),
  };
}

/**
 * Initialize Content Security Policy
 * Should be called during app initialization
 */
export function initializeCSP(): void {
  // Apply CSP as meta tag for client-side enforcement
  if (typeof window !== 'undefined') {
    const isProduction = process.env.NODE_ENV === 'production';
    applyCSPMetaTag(isProduction);
  }
}
