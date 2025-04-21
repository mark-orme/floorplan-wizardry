
/**
 * Content Security Policy Utilities
 */

// CSP configuration that balances security and functionality
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
  'upgrade-insecure-requests': []
};

export type CspDirective = keyof typeof DEFAULT_CSP_CONFIG;
export type CspConfig = Record<CspDirective, string[]>;

/**
 * Convert CSP config object to policy string
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
 * Apply CSP as a meta tag
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
 * Report CSP violations
 */
export const setupCspViolationReporting = (reportUri: string): void => {
  if (typeof document === 'undefined') return;
  
  // Add CSP report-uri directive
  const config: Partial<CspConfig> = {
    ...DEFAULT_CSP_CONFIG,
    'report-uri': [reportUri]
  };
  
  applyCspMetaTag(config);
  
  console.log('CSP violation reporting configured');
};
