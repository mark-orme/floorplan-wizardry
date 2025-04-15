
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect, useState } from 'react';
import { initializeCSP, checkCSPApplied, fixSentryCSP } from '@/utils/security/contentSecurityPolicy';
import { applySecurityMetaTags } from '@/utils/security/httpSecurity';
import logger from '@/utils/logger';
import { toast } from 'sonner';

/**
 * Component that initializes security features
 * Should be rendered at the root level of the application
 */
export const SecurityInitializer = () => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Force initialize Content Security Policy with a direct meta tag
    try {
      // Apply CSP with force refresh
      initializeCSP(true);
      
      // Apply additional security headers
      applySecurityMetaTags();
      
      logger.info('Security features initialized from component');
      
      // Verify CSP was properly applied
      const isValid = checkCSPApplied();
      
      if (!isValid) {
        logger.warn('Initial CSP verification failed, applying emergency fix');
        // Try an emergency fix - apply directly
        fixSentryCSP();
        
        // Recheck after a delay
        setTimeout(() => {
          const recheckValid = checkCSPApplied();
          if (recheckValid) {
            logger.info('CSP fixed successfully on second attempt');
            setVerified(true);
          } else {
            logger.error('Failed to apply proper CSP after multiple attempts');
            toast.error('Security initialization issue detected, some features may be limited');
          }
        }, 300);
      } else {
        logger.info('CSP verified successfully on first attempt');
        setVerified(true);
      }
      
      // Set up a continuous monitor for CSP
      const monitorInterval = setInterval(() => {
        if (!checkCSPApplied()) {
          logger.warn('CSP validation failed during runtime check, reapplying');
          fixSentryCSP();
        }
      }, 3000);
      
      // Set up security violation handler that's focused on fixing issues
      const handleSecurityViolation = (e: SecurityPolicyViolationEvent) => {
        // Only care about Sentry domain issues
        if (e.blockedURI.includes('sentry.io') || 
            e.blockedURI.includes('ingest.sentry.io')) {
          logger.warn('Sentry domain blocked by CSP, attempting fix', {
            domain: e.blockedURI,
            directive: e.violatedDirective
          });
          
          // Immediate fix attempt
          fixSentryCSP();
        }
      };
      
      window.addEventListener('securitypolicyviolation', handleSecurityViolation);
      
      return () => {
        clearInterval(monitorInterval);
        window.removeEventListener('securitypolicyviolation', handleSecurityViolation);
      };
    } catch (error) {
      logger.error('Error initializing security features', { error });
      
      // Try one more time
      setTimeout(() => {
        try {
          initializeCSP(true);
          logger.info('Emergency CSP applied after error');
        } catch (retryError) {
          logger.error('Failed to initialize security features on retry', { error: retryError });
        }
      }, 500);
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
