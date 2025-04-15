
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect } from 'react';
import { initializeCSP } from '@/utils/security/contentSecurityPolicy';
import { applySecurityMetaTags } from '@/utils/security/httpSecurity';
import logger from '@/utils/logger';
import { toast } from 'sonner';

/**
 * Component that initializes security features
 * Should be rendered at the root level of the application
 */
export const SecurityInitializer = () => {
  useEffect(() => {
    // Initialize Content Security Policy with production settings in production mode
    const isProduction = process.env.NODE_ENV === 'production';
    initializeCSP();
    
    // Apply additional security headers
    applySecurityMetaTags();
    
    logger.info('Security features initialized');
    
    // Add iframe protection with better error handling
    if (window.top !== window.self) {
      logger.warn('Application loaded in iframe - checking if allowed origin');
      
      // Handle iframes more gracefully
      try {
        // Check if parent origin is allowed (lovable.dev or our own domain)
        const parentUrl = new URL(document.referrer);
        const isAllowedOrigin = 
          parentUrl.hostname.endsWith('lovable.dev') || 
          parentUrl.hostname === window.location.hostname;
        
        if (!isAllowedOrigin) {
          logger.warn('Application loaded in iframe from disallowed origin', {
            referrer: document.referrer
          });
          
          toast.error('This application cannot be displayed in an iframe from this origin for security reasons.');
          
          // Attempt to break out of iframe if not from allowed origin
          // This will now be a more controlled attempt that won't cause console errors
          if (window.top.location.href !== window.self.location.href) {
            const newLocation = window.self.location.href;
            // Use user-triggered timeout to avoid navigation blocking
            setTimeout(() => {
              try {
                window.top.location.href = newLocation;
              } catch (e) {
                // If blocked, at least we tried and didn't throw an error
                logger.info('Navigation to top frame was blocked by browser security policy');
              }
            }, 100);
          }
        } else {
          logger.info('Application loaded in iframe from allowed origin', {
            referrer: document.referrer
          });
        }
      } catch (e) {
        // Just log the error without showing a toast to users
        logger.error('Failed to check iframe origin - possible cross-origin restriction', { 
          error: e,
          message: e instanceof Error ? e.message : 'Unknown error'
        });
      }
    }
    
    // Add event listener for security violations with better error handling
    const handleSecurityViolation = (e: SecurityPolicyViolationEvent) => {
      logger.warn('CSP violation detected', {
        directive: e.violatedDirective,
        blockedURI: e.blockedURI,
        originalPolicy: e.originalPolicy
      });
      
      // Only show toast for significant violations in production
      if (isProduction && 
          (e.violatedDirective === 'script-src' || e.violatedDirective === 'frame-src')) {
        toast.error('Security policy violation detected and blocked');
      }
    };
    
    window.addEventListener('securitypolicyviolation', handleSecurityViolation);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('securitypolicyviolation', handleSecurityViolation);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
