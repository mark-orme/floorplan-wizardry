
/**
 * Content Security Policy Utilities
 * 
 * This module provides a comprehensive set of utilities for managing Content Security Policy (CSP)
 * in web applications. CSP is a security feature that helps prevent cross-site scripting (XSS),
 * clickjacking, and other code injection attacks.
 * 
 * @module utils/security/cspUtils
 */

/**
 * Default CSP configuration that balances security and functionality.
 * This provides a reasonably secure baseline that works with most modern web applications.
 * Customize as needed for your specific security requirements.
 */
export const DEFAULT_CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline in production
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'frame-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'block-all-mixed-content': [],
  'upgrade-insecure-requests': [],
  'report-uri': [] // Added for CSP violation reporting
};

/**
 * Valid CSP directive names as defined in the CSP specification.
 * This union type ensures type safety when working with CSP directives.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */
export type CspDirective =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'font-src'
  | 'connect-src'
  | 'frame-src'
  | 'object-src'
  | 'base-uri'
  | 'form-action'
  | 'frame-ancestors'
  | 'block-all-mixed-content'
  | 'upgrade-insecure-requests'
  | 'report-uri';

/**
 * Type definition for a complete CSP configuration.
 * Maps each CSP directive to an array of allowed sources.
 */
export type CspConfig = Record<CspDirective, string[]>;

/**
 * Convert CSP config object to policy string
 * 
 * Transforms a CSP configuration object into a properly formatted CSP policy string
 * that can be used in HTTP headers or meta tags.
 * 
 * @param config - Partial CSP configuration to merge with defaults
 * @returns Formatted CSP policy string
 * 
 * @example
 * ```typescript
 * const policyString = buildCspString({
 *   'script-src': ["'self'", "trusted-cdn.example.com"]
 * });
 * // Returns: "default-src 'self'; script-src 'self' trusted-cdn.example.com; ..."
 * ```
 */
export const buildCspString = (config: Partial<CspConfig> = {}): string => {
  // Merge with default config
  const fullConfig = { ...DEFAULT_CSP_CONFIG, ...config };
  
  return Object.entries(fullConfig)
    .map(([directive, sources]) => {
      // Handle boolean directives that don't need sources
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .filter(Boolean)
    .join('; ');
};

/**
 * Apply CSP as a meta tag in the document head
 * 
 * Adds or updates a Content-Security-Policy meta tag in the document.
 * This is useful for client-side CSP enforcement when HTTP headers cannot be set.
 * 
 * @param config - Partial CSP configuration to apply
 * 
 * @example
 * ```typescript
 * // Apply a custom CSP with stricter script sources
 * applyCspMetaTag({
 *   'script-src': ["'self'"] // Disallow inline scripts
 * });
 * ```
 */
export const applyCspMetaTag = (config: Partial<CspConfig> = {}): void => {
  if (typeof document === 'undefined') return;
  
  // Remove existing CSP meta tag if present
  const existingCspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existingCspMeta) {
    existingCspMeta.remove();
  }
  
  // Create and add CSP meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = buildCspString(config);
  document.head.appendChild(cspMeta);
};

/**
 * Initialize CSP with security headers
 * 
 * Sets up Content Security Policy and other security headers as meta tags.
 * Call this during application initialization to establish baseline security.
 * 
 * @param config - Optional custom CSP configuration to apply
 * 
 * @example
 * ```typescript
 * // In your app initialization code:
 * useEffect(() => {
 *   initializeCSP();
 * }, []);
 * ```
 */
export const initializeCSP = (config: Partial<CspConfig> = {}): void => {
  if (typeof document === 'undefined') return;
  
  // Apply CSP
  applyCspMetaTag(config);
  
  // Add other security headers as meta tags
  const headers = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
  ];
  
  headers.forEach(header => {
    const existingHeader = document.querySelector(`meta[http-equiv="${header.httpEquiv}"]`);
    if (!existingHeader) {
      const meta = document.createElement('meta');
      meta.httpEquiv = header.httpEquiv;
      meta.content = header.content;
      document.head.appendChild(meta);
    }
  });
  
  console.log('Content Security Policy initialized');
};

/**
 * Configure CSP violation reporting
 * 
 * Adds a report-uri directive to the CSP to send violation reports to a specified endpoint.
 * This helps monitor potential attacks and implementation issues in production.
 * 
 * @param reportUri - URI where CSP violation reports will be sent
 * 
 * @example
 * ```typescript
 * // Send CSP violation reports to your monitoring endpoint
 * setupCspViolationReporting('https://example.com/csp-report-endpoint');
 * ```
 */
export const setupCspViolationReporting = (reportUri: string): void => {
  if (typeof document === 'undefined') return;

  // Add CSP report-uri directive
  const config: Partial<CspConfig> = {
    'report-uri': [reportUri]
  };

  applyCspMetaTag(config);

  console.log('CSP violation reporting configured');
};
