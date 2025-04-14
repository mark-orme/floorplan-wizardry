
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect } from 'react';
import { addCSPMetaTag } from '@/utils/security/htmlSanitization';
import { initializeSecureStorage } from '@/utils/security/secureStorage';
import logger from '@/utils/logger';

/**
 * Component that initializes security features
 * Should be rendered at the root level of the application
 */
export const SecurityInitializer = () => {
  useEffect(() => {
    // Add Content Security Policy meta tags
    addCSPMetaTag();
    
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
