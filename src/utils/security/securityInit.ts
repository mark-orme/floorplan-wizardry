
/**
 * Centralized Security Initialization
 * Sets up all security features on application startup
 */

import { createFormProtection, generateCSRFToken } from './enhancedCsrfProtection';
import { enableOfflineEncryption } from './offlineEncryption';
import { isEncryptionSupported } from './dataEncryption';
import { toast } from 'sonner';

/**
 * Initialize all security features
 * Call this during application startup
 */
export function initializeSecurity(): void {
  if (typeof window === 'undefined') return;

  try {
    // Set up CSRF protection
    generateCSRFToken();
    createFormProtection();
    console.info('CSRF protection initialized');
    
    // Initialize encryption for offline data
    enableOfflineEncryption()
      .then(success => {
        if (success) {
          console.info('Offline encryption initialized');
        } else {
          console.warn('Failed to initialize offline encryption');
        }
      })
      .catch(error => {
        console.error('Error initializing offline encryption:', error);
      });
    
    // Check if encryption is supported
    if (!isEncryptionSupported()) {
      console.warn('Web Crypto API not supported in this browser. Encrypted storage will not be available.');
      toast.warning('Secure storage is not supported in this browser.', {
        description: 'Some security features may be limited.',
        duration: 5000
      });
    } else {
      console.info('Encryption supported and initialized');
    }
    
    // Apply security-related meta tags
    applySecurityHeaders();
    
    console.info('Security features initialized');
  } catch (error) {
    console.error('Failed to initialize security features:', error);
    toast.error('Failed to initialize security features', {
      description: 'Some security features may be unavailable.'
    });
  }
}

/**
 * Apply security-related headers via meta tags
 */
function applySecurityHeaders(): void {
  if (typeof document === 'undefined') return;

  // Set Content-Security-Policy
  const metaCSP = document.createElement('meta');
  metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
  metaCSP.setAttribute('content', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");
  document.head.appendChild(metaCSP);
  
  // Set referrer policy
  const metaReferrer = document.createElement('meta');
  metaReferrer.setAttribute('name', 'referrer');
  metaReferrer.setAttribute('content', 'same-origin');
  document.head.appendChild(metaReferrer);

  // Set X-Content-Type-Options
  const metaNoSniff = document.createElement('meta');
  metaNoSniff.setAttribute('http-equiv', 'X-Content-Type-Options');
  metaNoSniff.setAttribute('content', 'nosniff');
  document.head.appendChild(metaNoSniff);
}
