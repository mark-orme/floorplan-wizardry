
/**
 * Content Security Policy Utilities
 * Provides CSP configuration and implementation
 */
import logger from '@/utils/logger';
import { toast } from 'sonner';

// Master CSP string with all required domains - this is the source of truth
export const MASTER_CSP_STRING = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.lovable.dev https://*.lovable.dev https://o4508914471927808.ingest.de.sentry.io https://*.ingest.de.sentry.io https://*.ingest.sentry.io https://*.sentry.io https://sentry.io https://api.sentry.io https://ingest.sentry.io wss://ws-eu.pusher.com https://sockjs-eu.pusher.com wss://*.pusher.com https://*.pusher.com https://*.lovable.app ws: http://localhost:* http://*:* ws://*:*; frame-src 'self' https://*.lovable.dev https://*.lovable.app; object-src 'none'; base-uri 'self'; worker-src 'self' blob: 'unsafe-inline'; child-src 'self' blob:;";

// Define Content Security Policy directives (kept for backward compatibility)
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
    // ALL Sentry domains
    "https://o4508914471927808.ingest.de.sentry.io",
    "https://*.ingest.de.sentry.io",
    "https://*.ingest.sentry.io",
    "https://*.sentry.io",
    "https://sentry.io",
    "https://api.sentry.io",
    "https://ingest.sentry.io",
    // ALL Pusher domains
    "wss://ws-eu.pusher.com",
    "https://sockjs-eu.pusher.com",
    "wss://*.pusher.com",
    "https://*.pusher.com",
    "https://*.lovable.app",
    // Allow ALL local connections
    "ws:", 
    "wss:",
    "http://*:*",
    "ws://*:*",
    "http://localhost:*"
  ],
  'frame-src': ["'self'", "https://*.lovable.dev", "https://*.lovable.app"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  // Add explicit worker-src with 'unsafe-inline' to allow blob URLs for workers
  'worker-src': ["'self'", "blob:", "'unsafe-inline'"],
  'child-src': ["'self'", "blob:"],
};

// Production directives are same as development for simplicity
export const PRODUCTION_CSP_DIRECTIVES = DEVELOPMENT_CSP_DIRECTIVES;

/**
 * Build CSP string from directives
 */
export function buildCSPString(isProduction = false): string {
  // Always return the master CSP string for consistency
  return MASTER_CSP_STRING;
}

/**
 * Apply CSP as meta tag in document head - direct approach
 */
export function applyCSPMetaTag(isProduction = false): void {
  if (typeof document === 'undefined') return;
  
  try {
    // Remove any existing CSP meta tags to prevent duplication
    const existingCspTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    existingCspTags.forEach(tag => tag.remove());
    
    // Create and apply CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = MASTER_CSP_STRING;
    document.head.appendChild(cspMeta);
    
    // Add a data attribute to indicate CSP was applied
    document.documentElement.setAttribute('data-csp-applied', 'true');
    document.documentElement.setAttribute('data-csp-timestamp', Date.now().toString());
    
    // Log the applied CSP
    logger.info('Content Security Policy applied via meta tag');
  } catch (error) {
    logger.error('Failed to apply CSP meta tag', { error });
  }
}

/**
 * Get CSP headers for server-side implementation
 */
export function getCSPHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': MASTER_CSP_STRING,
  };
}

/**
 * Initialize Content Security Policy
 * Should be called during app initialization
 */
export function initializeCSP(forceRefresh = false): void {
  // Apply CSP as meta tag for client-side enforcement
  if (typeof window !== 'undefined') {
    // Force removal if requested
    if (forceRefresh) {
      const existingCspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (existingCspTag) {
        existingCspTag.remove();
        logger.info('Removed existing CSP meta tag for refresh');
      }
    }
    
    // Apply the CSP meta tag directly
    applyCSPMetaTag();
    
    // Log successful initialization
    logger.info('Content Security Policy initialized with Sentry domains');
  }
}

/**
 * Simple function to check if CSP is properly applied
 */
export function checkCSPApplied(): boolean {
  if (typeof document === 'undefined') return false;
  
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspTag) return false;
  
  const content = cspTag.getAttribute('content') || '';
  // Make sure we specifically check for the sentry.io domain in the CSP
  return content.includes('sentry.io') && 
         content.includes('o4508914471927808.ingest.de.sentry.io') &&
         content.includes('pusher.com');
}

/**
 * Emergency fix function for Sentry CSP issues
 */
export function fixSentryCSP(): void {
  if (!checkCSPApplied()) {
    console.warn('CSP missing Sentry domains, forcing refresh...');
    
    // Remove existing CSP
    const existingCspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCspTag) {
      existingCspTag.remove();
    }
    
    // Apply the master CSP directly
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = MASTER_CSP_STRING;
    document.head.appendChild(meta);
    
    // Set data attribute
    document.documentElement.setAttribute('data-csp-applied', 'true');
    document.documentElement.setAttribute('data-csp-timestamp', Date.now().toString());
    
    // Log the emergency fix
    logger.info('Emergency CSP fix applied');
    toast.info('Security policy refreshed to allow error reporting');
  }
}
