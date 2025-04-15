
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
    // Force initialize Content Security Policy with a direct meta tag
    // This ensures CSP is enforced immediately
    try {
      initializeCSP(true); // Force refresh parameter
      
      // Apply additional security headers
      applySecurityMetaTags();
      
      logger.info('Security features initialized');
    } catch (initError) {
      logger.error('Failed to initialize security features', { error: initError });
    }
    
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
    
    // Create a more refined CSP violation handler that doesn't log every single violation
    // This reduces noise in the console
    const handleSecurityViolation = (e: SecurityPolicyViolationEvent) => {
      // Create a list of domains and sources to filter out noise
      const knownViolations = [
        { domain: 'sentry.io', directive: 'connect-src' },
        { domain: 'o4508914471927808.ingest.de.sentry.io', directive: 'connect-src' },
        { domain: 'pusher.com', directive: 'connect-src' },
        { domain: 'sockjs-eu.pusher.com', directive: 'connect-src' },
        { domain: 'ws-eu.pusher.com', directive: 'connect-src' },
        { domain: 'ingest.sentry.io', directive: 'connect-src' },
        { domain: 'api.sentry.io', directive: 'connect-src' },
        { source: 'blob', directive: 'worker-src' }
      ];
      
      // Check if this is a known violation we want to filter
      const shouldSkipLogging = knownViolations.some(violation => 
        (e.blockedURI.includes(violation.domain || '') && 
        e.violatedDirective === violation.directive) ||
        (violation.source && e.blockedURI === violation.source && 
        e.violatedDirective === violation.directive)
      );
      
      // Only log new violations in development mode
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (!shouldSkipLogging || !isProduction) {
        // Log at most once per minute per endpoint to reduce noise
        const violationKey = `${e.violatedDirective}:${e.blockedURI}`;
        const lastReported = window.__csp_violations?.[violationKey] || 0;
        const now = Date.now();
        
        // Initialize violations object if it doesn't exist
        if (!window.__csp_violations) {
          window.__csp_violations = {};
        }
        
        // Only log if more than 60 seconds since last report for this violation
        if (now - lastReported > 60000) {
          window.__csp_violations[violationKey] = now;
          
          logger.warn('CSP violation detected', {
            directive: e.violatedDirective,
            blockedURI: e.blockedURI,
            originalPolicy: e.originalPolicy
          });
          
          // Attempt to auto-fix common CSP issues
          if (e.violatedDirective === 'connect-src') {
            // Refresh CSP to ensure it has the latest domains
            setTimeout(() => {
              initializeCSP(true);
              logger.info('CSP refreshed after violation');
            }, 100);
          }
        }
      }
      
      // Only show toast for significant violations in production
      if (isProduction && 
          (e.violatedDirective === 'script-src' || e.violatedDirective === 'frame-src') &&
          !e.blockedURI.includes('sentry.io') &&
          !e.blockedURI.includes('pusher.com')) {
        toast.error('Security policy violation detected and blocked');
      }
    };
    
    // Declare the CSP violations object on window
    if (typeof window !== 'undefined' && !window.__csp_violations) {
      window.__csp_violations = {};
    }
    
    window.addEventListener('securitypolicyviolation', handleSecurityViolation);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('securitypolicyviolation', handleSecurityViolation);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

// Add the __csp_violations property to the Window interface
declare global {
  interface Window {
    __csp_violations?: Record<string, number>;
  }
}

export default SecurityInitializer;
