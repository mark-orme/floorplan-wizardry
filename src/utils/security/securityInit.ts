
/**
 * Security Initialization
 * Setup code for security features
 */

import { generateCSRFToken } from './enhancedCsrfProtection';
import { enableOfflineEncryption } from './offlineEncryption';

/**
 * Initialize all security features
 */
export function initializeSecurity(): void {
  if (typeof window === 'undefined') return;
  
  // Generate initial CSRF token
  generateCSRFToken();
  
  // Enable offline encryption
  enableOfflineEncryption();
  
  // Add security-related meta tags
  addSecurityHeaders();
  
  console.info('Security features initialized');
}

/**
 * Add security headers as meta tags
 */
function addSecurityHeaders(): void {
  if (typeof document === 'undefined') return;
  
  // Add Content-Security-Policy meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "default-src 'self'; script-src 'self'; object-src 'none';";
  document.head.appendChild(cspMeta);
  
  // Add Referrer-Policy meta tag
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = 'no-referrer';
  document.head.appendChild(referrerMeta);
  
  // Add X-Content-Type-Options meta tag
  const xContentTypeMeta = document.createElement('meta');
  xContentTypeMeta.httpEquiv = 'X-Content-Type-Options';
  xContentTypeMeta.content = 'nosniff';
  document.head.appendChild(xContentTypeMeta);
}
