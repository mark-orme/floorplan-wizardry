
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect } from 'react';
import { initializeSecureStorage } from '@/utils/security/secureStorage';
import { initializeCSP } from '@/utils/security/contentSecurityPolicy';
import logger from '@/utils/logger';

/**
 * Component that initializes security features
 * Should be rendered at the root level of the application
 */
export const SecurityInitializer = () => {
  useEffect(() => {
    // Initialize Content Security Policy
    initializeCSP();
    
    // Initialize secure storage
    initializeSecureStorage();
    
    logger.info('Security features initialized');
    
    // Add iframe protection
    if (window.top !== window.self) {
      logger.warn('Application loaded in iframe - potential security risk');
      // Optional: force breaking out of iframes
      // window.top.location.href = window.self.location.href;
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
