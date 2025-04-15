
/**
 * Content Security Policy Utilities
 * Provides CSP configuration and implementation
 */
import logger from '@/utils/logger';
import { toast } from 'sonner';

// Define Content Security Policy directives for production
export const PRODUCTION_CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'", 
    "https://*.supabase.co", 
    "wss://*.lovable.dev",
    "https://*.lovable.dev",
    "https://o4508914471927808.ingest.de.sentry.io",
    "https://*.ingest.sentry.io",
    "https://*.sentry.io",
    "https://sentry.io",
    "https://api.sentry.io",
    "https://ingest.sentry.io",
    "wss://ws-eu.pusher.com",
    "https://sockjs-eu.pusher.com",
    "wss://*.pusher.com",
    "https://*.pusher.com",
    "https://*.lovable.app"
  ],
  'frame-src': ["'self'", "https://*.lovable.dev", "https://*.lovable.app"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'worker-src': ["'self'", "blob:"],
  'child-src': ["'self'", "blob:"],
  'upgrade-insecure-requests': [],
};

// Define Content Security Policy directives for development (less strict)
export const DEVELOPMENT_CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'", 
    "https://*.supabase.co", 
    "wss://*.lovable.dev",
    "https://*.lovable.dev", 
    "https://o4508914471927808.ingest.de.sentry.io",
    "https://*.ingest.sentry.io",
    "https://*.sentry.io",
    "https://sentry.io",
    "https://api.sentry.io",
    "https://ingest.sentry.io",
    "wss://ws-eu.pusher.com",
    "https://sockjs-eu.pusher.com",
    "wss://*.pusher.com",
    "https://*.pusher.com",
    "https://*.lovable.app",
    "ws:", 
    "http://localhost:*"
  ],
  'frame-src': ["'self'", "https://*.lovable.dev", "https://*.lovable.app"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'worker-src': ["'self'", "blob:"],
  'child-src': ["'self'", "blob:"],
};

/**
 * Build CSP string from directives
 */
export function buildCSPString(isProduction = false): string {
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
 */
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Apply CSP as meta tag in document head
 * Completely replaces existing CSP meta tag to ensure fresh values
 */
export function applyCSPMetaTag(isProduction = false): void {
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
    
    // Add a data attribute to indicate CSP was applied
    document.documentElement.setAttribute('data-csp-applied', 'true');
    
    // Log the applied CSP
    console.log('Content Security Policy applied:', cspContent);
    logger.info('Content Security Policy applied via meta tag', {
      mode: isProduction ? 'production' : 'development',
      content: cspContent
    });
  } catch (error) {
    logger.error('Failed to apply CSP meta tag', { error });
  }
}

/**
 * Get CSP headers for server-side implementation
 */
export function getCSPHeaders(isProduction = false): Record<string, string> {
  return {
    'Content-Security-Policy': buildCSPString(isProduction),
  };
}

/**
 * Initialize Content Security Policy
 * Should be called during app initialization BEFORE any Sentry initialization
 */
export function initializeCSP(forceRefresh = false): void {
  // Apply CSP as meta tag for client-side enforcement
  if (typeof window !== 'undefined') {
    // Always use development CSP for now which is less restrictive
    const isProduction = false;
    
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
    logger.info('Content Security Policy initialized with Sentry domains', {
      mode: isProduction ? 'production' : 'development',
      allowedConnections: isProduction ? 
        PRODUCTION_CSP_DIRECTIVES['connect-src'].join(', ') : 
        DEVELOPMENT_CSP_DIRECTIVES['connect-src'].join(', ')
    });
  }
}

// Simple function to check if CSP is properly applied
export function checkCSPApplied(): boolean {
  if (typeof document === 'undefined') return false;
  
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspTag) return false;
  
  const content = cspTag.getAttribute('content') || '';
  return content.includes('sentry.io') && content.includes('o4508914471927808.ingest.de.sentry.io');
}

// Export a simple fix function that we can call anywhere to correct CSP issues
export function fixSentryCSP(): void {
  if (!checkCSPApplied()) {
    console.warn('CSP missing Sentry domains, forcing refresh...');
    initializeCSP(true);
    toast.info('Security policy refreshed to allow error reporting');
  }
}
