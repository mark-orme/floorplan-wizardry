
/**
 * Content Security Policy Utilities
 * Implements CSP to mitigate XSS attacks
 */
import logger from '@/utils/logger';

/**
 * CSP Directive Types
 */
export interface CSPDirectives {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  reportUri?: string;
  reportTo?: string;
}

/**
 * Generate Content Security Policy header value
 * @param directives CSP directive configuration
 * @returns Formatted CSP header value
 */
export function generateCSPHeader(directives: CSPDirectives): string {
  const parts: string[] = [];
  
  // Add each directive
  if (directives.defaultSrc) {
    parts.push(`default-src ${directives.defaultSrc.join(' ')}`);
  }
  
  if (directives.scriptSrc) {
    parts.push(`script-src ${directives.scriptSrc.join(' ')}`);
  }
  
  if (directives.styleSrc) {
    parts.push(`style-src ${directives.styleSrc.join(' ')}`);
  }
  
  if (directives.imgSrc) {
    parts.push(`img-src ${directives.imgSrc.join(' ')}`);
  }
  
  if (directives.connectSrc) {
    parts.push(`connect-src ${directives.connectSrc.join(' ')}`);
  }
  
  if (directives.fontSrc) {
    parts.push(`font-src ${directives.fontSrc.join(' ')}`);
  }
  
  if (directives.objectSrc) {
    parts.push(`object-src ${directives.objectSrc.join(' ')}`);
  }
  
  if (directives.mediaSrc) {
    parts.push(`media-src ${directives.mediaSrc.join(' ')}`);
  }
  
  if (directives.frameSrc) {
    parts.push(`frame-src ${directives.frameSrc.join(' ')}`);
  }
  
  if (directives.reportUri) {
    parts.push(`report-uri ${directives.reportUri}`);
  }
  
  if (directives.reportTo) {
    parts.push(`report-to ${directives.reportTo}`);
  }
  
  return parts.join('; ');
}

/**
 * Default CSP configuration for the application
 */
export const DEFAULT_CSP_DIRECTIVES: CSPDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"], // Unsafe inline necessary for React in development
  styleSrc: ["'self'", "'unsafe-inline'"],  // Unsafe inline necessary for styled-components
  imgSrc: ["'self'", "data:", "blob:"],
  connectSrc: ["'self'"],
  fontSrc: ["'self'", "data:"],
  objectSrc: ["'none'"],
  reportUri: '/api/csp-report',
};

/**
 * Apply CSP to the document using meta tag
 * Useful for static hosting where HTTP headers can't be set
 */
export function applyCSPMeta(directives: CSPDirectives = DEFAULT_CSP_DIRECTIVES): void {
  if (typeof document === 'undefined') return;
  
  try {
    // Remove existing CSP meta tag if present
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingMeta) {
      existingMeta.remove();
    }
    
    // Create and add the new meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = generateCSPHeader(directives);
    document.head.appendChild(meta);
    
    logger.info('CSP meta tag applied', { directives });
  } catch (error) {
    logger.error('Failed to apply CSP meta tag', { error });
  }
}

/**
 * Apply security-related meta tags to the document
 */
export function applySecurityMeta(): void {
  if (typeof document === 'undefined') return;
  
  try {
    // X-XSS-Protection
    const xssProtection = document.createElement('meta');
    xssProtection.httpEquiv = 'X-XSS-Protection';
    xssProtection.content = '1; mode=block';
    document.head.appendChild(xssProtection);
    
    // X-Content-Type-Options
    const contentTypeOptions = document.createElement('meta');
    contentTypeOptions.httpEquiv = 'X-Content-Type-Options';
    contentTypeOptions.content = 'nosniff';
    document.head.appendChild(contentTypeOptions);
    
    // Referrer Policy
    const referrerPolicy = document.createElement('meta');
    referrerPolicy.name = 'referrer';
    referrerPolicy.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerPolicy);
    
    logger.info('Security meta tags applied');
  } catch (error) {
    logger.error('Failed to apply security meta tags', { error });
  }
}

/**
 * Initialize all security features
 */
export function initializeSecurity(): void {
  applyCSPMeta();
  applySecurityMeta();
}
