
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
      logger.info('Application loaded in iframe - checking if allowed origin');
      
      // Handle iframes more gracefully
      try {
        // Only check referrer if available
        if (document.referrer) {
          // Check if parent origin is allowed (lovable.dev, lovable.app, or our own domain)
          const parentUrl = new URL(document.referrer);
          const isAllowedOrigin = 
            parentUrl.hostname.endsWith('lovable.dev') || 
            parentUrl.hostname === window.location.hostname ||
            parentUrl.hostname.includes('lovable.app');
          
          if (!isAllowedOrigin) {
            logger.warn('Application loaded in iframe from disallowed origin', {
              referrer: document.referrer
            });
            
            toast.error('This application cannot be displayed in an iframe from this origin for security reasons.');
          } else {
            logger.info('Application loaded in iframe from allowed origin', {
              referrer: document.referrer
            });
          }
        }
      } catch (e) {
        // Log the error without showing a toast to users
        logger.error('Failed to check iframe origin - possible cross-origin restriction', { 
          error: e,
          message: e instanceof Error ? e.message : 'Unknown error'
        });
      }
    }
    
    // Filter CSP violations to reduce noise
    const handleSecurityViolation = (e: SecurityPolicyViolationEvent) => {
      // Create a list of domains and sources to filter out noise
      const knownViolations = [
        { domain: 'sentry.io', directive: 'connect-src' },
        { domain: 'o4508914471927808.ingest.de.sentry.io', directive: 'connect-src' },
        { domain: 'pusher.com', directive: 'connect-src' },
        { domain: 'sockjs-eu.pusher.com', directive: 'connect-src' },
        { domain: 'ws-eu.pusher.com', directive: 'connect-src' },
        { source: 'blob', directive: 'worker-src' }
      ];
      
      // Check if this is a known violation we want to filter
      const shouldSkipLogging = knownViolations.some(violation => 
        e.blockedURI.includes(violation.domain || '') && 
        e.violatedDirective === violation.directive
      );
      
      if (!shouldSkipLogging) {
        logger.warn('CSP violation detected', {
          directive: e.violatedDirective,
          blockedURI: e.blockedURI,
          originalPolicy: e.originalPolicy
        });
      }
      
      // Only show toast for significant violations in production
      if (isProduction && 
          (e.violatedDirective === 'script-src' || e.violatedDirective === 'frame-src') &&
          !e.blockedURI.includes('sentry.io') &&
          !e.blockedURI.includes('pusher.com')) {
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
