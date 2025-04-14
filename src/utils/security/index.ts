
/**
 * Security Utilities Index
 * Centralizes security features for the application
 * @module utils/security
 */

// Export all security features
export * from './csrfProtection';
export * from './cookieSecurity';
export * from './fileUploadSecurity';
export * from './inputSanitization';
export * from './rateLimiting';

// Export a convenience object for importing all security features
import * as CSRFProtection from './csrfProtection';
import * as CookieSecurity from './cookieSecurity';
import * as FileUploadSecurity from './fileUploadSecurity';
import * as InputSanitization from './inputSanitization';
import * as RateLimiting from './rateLimiting';

export const Security = {
  CSRF: CSRFProtection,
  Cookies: CookieSecurity,
  Files: FileUploadSecurity,
  Input: InputSanitization,
  RateLimit: RateLimiting,
  isSecureConnection: (): boolean => 
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
};

/**
 * Perform security initialization on app startup
 */
export function initializeSecurity(): void {
  // Set security-related HTTP headers if possible
  if (typeof document !== 'undefined') {
    // This is a frontend-only approach since we can't set HTTP headers directly
    // In a real app, these would be set by the server
    
    // Apply CSP meta tag for browsers that support it
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://*.supabase.co; font-src 'self';";
    document.head.appendChild(cspMeta);
    
    console.info('Frontend security initialized');
  }
}

/**
 * Check if the current connection uses HTTPS
 * @returns Whether the connection is secure
 */
export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

/**
 * Apply security measures to a form element
 * @param form Form element to secure
 */
export function secureForm(form: HTMLFormElement): void {
  // Apply CSRF protection
  CSRFProtection.protectForm(form);
  
  // Add novalidate to use our own validation
  form.setAttribute('novalidate', 'true');
  
  // Ensure proper enctype for file uploads
  const hasFileInputs = form.querySelector('input[type="file"]') !== null;
  if (hasFileInputs && !form.getAttribute('enctype')) {
    form.setAttribute('enctype', 'multipart/form-data');
  }
}
