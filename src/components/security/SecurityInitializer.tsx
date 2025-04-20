
import { useEffect } from 'react';
import { initializeSecurity } from '@/utils/security/securityInit';
import { isEncryptionSupported } from '@/utils/security/dataEncryption';
import { generateCSRFToken } from '@/utils/security/csrfProtection';
import { enableOfflineEncryption } from '@/utils/security/offlineEncryption';
import { toast } from 'sonner';

/**
 * Component to initialize security features on application startup
 */
export default function SecurityInitializer() {
  useEffect(() => {
    // Initialize all security features
    initializeSecurity();
    
    // Set up CSRF protection
    generateCSRFToken();
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
    if (typeof document !== 'undefined') {
      // Set Content-Security-Policy
      const metaCSP = document.createElement('meta');
      metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
      metaCSP.setAttribute('content', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");
      document.head.appendChild(metaCSP);
      
      // Set referrer policy
      const metaReferrer = document.createElement('meta');
      metaReferrer.setAttribute('name', 'referrer');
      metaReferrer.content = 'same-origin'; // Stricter referrer policy
      document.head.appendChild(metaReferrer);
    }
    
    // Log security initialization
    console.info('Security features initialized');
  }, []);
  
  // This component doesn't render anything
  return null;
}
