
/**
 * Content Security Policy Utilities
 * Provides CSP configuration and implementation
 */
import logger from '@/utils/logger';

// Define Content Security Policy directives for production
export const PRODUCTION_CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline for better compatibility
  'style-src': ["'self'", "'unsafe-inline'"], // Unsafe-inline needed for shadcn/ui
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'", 
    "https://*.supabase.co", 
    "wss://*.lovable.dev",
    "https://*.lovable.dev",
    "https://*.sentry.io",
    "https://o4508914471927808.ingest.de.sentry.io",
    "wss://ws-eu.pusher.com",
    "https://sockjs-eu.pusher.com",
    "wss://*.pusher.com",
    "https://*.pusher.com",
    "https://*.lovable.app", // Adding lovable.app domain
    "https://api.sentry.io",
    "https://ingest.sentry.io"
  ],
  'frame-src': ["'self'", "https://*.lovable.dev", "https://*.lovable.app"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'worker-src': ["'self'", "blob:"], // Add worker-src to allow blob URLs for workers
  'upgrade-insecure-requests': [],
};

// Define Content Security Policy directives for development (less strict)
export const DEVELOPMENT_CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline scripts and eval in dev
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'", 
    "https://*.supabase.co", 
    "wss://*.lovable.dev",
    "https://*.lovable.dev", 
    "https://*.sentry.io",
    "https://o4508914471927808.ingest.de.sentry.io",
    "wss://ws-eu.pusher.com",
    "https://sockjs-eu.pusher.com",
    "wss://*.pusher.com",
    "https://*.pusher.com",
    "https://*.lovable.app", // Adding lovable.app domain
    "https://api.sentry.io",
    "https://ingest.sentry.io",
    "ws:", 
    "http://localhost:*"
  ],
  'frame-src': ["'self'", "https://*.lovable.dev", "https://*.lovable.app"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'worker-src': ["'self'", "blob:"], // Add worker-src to allow blob URLs for workers
};

/**
 * Build CSP string from directives
 * @param isProduction Whether to use production CSP directives
 * @returns Formatted CSP header value
 */
export function buildCSPString(isProduction = false): string {  // Default to development CSP
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
 * Completely replaces existing CSP meta tag to ensure fresh values
 * @param isProduction Whether to use production CSP directives
 */
export function applyCSPMetaTag(isProduction = false): void {  // Default to development CSP
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
    
    logger.info('Content Security Policy applied via meta tag', {
      mode: isProduction ? 'production' : 'development',
      hasConnectSrc: cspContent.includes('connect-src')
    });
  } catch (error) {
    logger.error('Failed to apply CSP meta tag', { error });
  }
}

/**
 * Get CSP headers for server-side implementation
 * @param isProduction Whether to use production CSP directives
 * @returns Object with CSP headers
 */
export function getCSPHeaders(isProduction = false): Record<string, string> {  // Default to development CSP
  return {
    'Content-Security-Policy': buildCSPString(isProduction),
  };
}

/**
 * Initialize Content Security Policy
 * Should be called during app initialization
 * @param forceRefresh Force refresh of CSP meta tag
 */
export function initializeCSP(forceRefresh = false): void {
  // Apply CSP as meta tag for client-side enforcement
  if (typeof window !== 'undefined') {
    // Always use development CSP for now to allow connections
    const isProduction = false; // Force development CSP which is less restrictive
    
    // Force application of CSP meta tag if refresh requested
    if (forceRefresh) {
      const existingCspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (existingCspTag) {
        existingCspTag.remove();
        logger.info('Removed existing CSP meta tag for refresh');
      }
    }
    
    applyCSPMetaTag(isProduction);
    
    // Log successful initialization
    logger.info('Content Security Policy initialized', {
      mode: isProduction ? 'production' : 'development',
      allowedConnections: isProduction ? 
        PRODUCTION_CSP_DIRECTIVES['connect-src'].join(', ') : 
        DEVELOPMENT_CSP_DIRECTIVES['connect-src'].join(', ')
    });
  }
}
