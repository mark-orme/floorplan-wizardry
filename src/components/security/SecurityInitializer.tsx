
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect } from 'react';
import { initializeSecureStorage } from '@/utils/security/secureStorage';
import { initializeCSP } from '@/utils/security/contentSecurityPolicy';
import logger from '@/utils/logger';
import { toast } from 'sonner';

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
      toast.error('This application cannot be displayed in an iframe for security reasons.');
      
      // Force breaking out of iframes for better security
      try {
        window.top.location.href = window.self.location.href;
      } catch (e) {
        logger.error('Failed to break out of iframe - possible clickjacking risk', { error: e });
      }
    }
    
    // Add event listener for security violations
    window.addEventListener('securitypolicyviolation', (e) => {
      logger.warn('CSP violation detected', {
        directive: e.violatedDirective,
        blockedURI: e.blockedURI,
        originalPolicy: e.originalPolicy
      });
      
      // Only show toast for significant violations in production
      if (process.env.NODE_ENV === 'production' && 
          (e.violatedDirective === 'script-src' || e.violatedDirective === 'frame-src')) {
        toast.error('Security policy violation detected and blocked');
      }
    });
    
    // Add referrer policy meta tag for privacy
    const metaReferrer = document.createElement('meta');
    metaReferrer.name = 'referrer';
    metaReferrer.content = 'no-referrer';
    document.head.appendChild(metaReferrer);
    
    // Add frame options to prevent clickjacking
    const metaFrameOptions = document.createElement('meta');
    metaFrameOptions.httpEquiv = 'X-Frame-Options';
    metaFrameOptions.content = 'DENY';
    document.head.appendChild(metaFrameOptions);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('securitypolicyviolation', () => {});
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
