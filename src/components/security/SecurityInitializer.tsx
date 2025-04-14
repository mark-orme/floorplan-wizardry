
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect } from 'react';
import { initializeSecureStorage } from '@/utils/security/secureStorage';
import { initializeCSP } from '@/utils/security/contentSecurityPolicy';
import logger from '@/utils/logger';
import { addCSPMetaTag } from '@/utils/security/htmlSanitization';

/**
 * Component that initializes security features
 * Should be rendered at the root level of the application
 */
export const SecurityInitializer = () => {
  useEffect(() => {
    // Initialize Content Security Policy
    initializeCSP();
    
    // Double-check CSP through HTML sanitization module
    addCSPMetaTag();
    
    // Initialize secure storage
    initializeSecureStorage();
    
    logger.info('Security features initialized');
    
    // Add iframe protection
    if (window.top !== window.self) {
      logger.warn('Application loaded in iframe - potential security risk');
      // Force breaking out of iframes for better security
      try {
        window.top.location.href = window.self.location.href;
      } catch (e) {
        logger.error('Failed to break out of iframe - possible clickjacking risk', { error: e });
      }
    }
    
    // Add event listener for security violations
    if (typeof window !== 'undefined') {
      window.addEventListener('securitypolicyviolation', (e) => {
        logger.warn('CSP violation detected', {
          directive: e.violatedDirective,
          blockedURI: e.blockedURI,
          originalPolicy: e.originalPolicy
        });
      });
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
