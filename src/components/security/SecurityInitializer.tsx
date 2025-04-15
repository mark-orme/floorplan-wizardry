
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
      // Apply with force refresh
      initializeCSP(true); 
      
      // Apply additional security headers
      applySecurityMetaTags();
      
      logger.info('Security features initialized successfully');
      
      // Extra check to verify CSP was applied
      const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!cspTag) {
        logger.warn('CSP meta tag not found after initialization, retrying...');
        setTimeout(() => initializeCSP(true), 100);
      } else {
        // Log the actual content to verify
        const content = cspTag.getAttribute('content');
        logger.info('CSP meta tag verified', { content });
        console.log('Applied CSP:', content);
        
        // Check if Sentry and Pusher domains are included
        if (content) {
          const hasSentryDomains = content.includes('sentry.io');
          const hasPusherDomains = content.includes('pusher.com');
          
          logger.info('CSP domains verification', { 
            hasSentryDomains, 
            hasPusherDomains 
          });
          
          // If domains are missing, try to reapply
          if (!hasSentryDomains || !hasPusherDomains) {
            logger.warn('CSP missing required domains, reapplying...');
            setTimeout(() => initializeCSP(true), 200);
          }
        }
      }
    } catch (initError) {
      logger.error('Failed to initialize security features', { error: initError });
      
      // Emergency retry with timeout in case of failure
      setTimeout(() => {
        try {
          initializeCSP(true);
          logger.info('Security features initialized on second attempt');
        } catch (retryError) {
          logger.error('Second attempt to initialize security features failed', { error: retryError });
        }
      }, 500);
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
          if (e.violatedDirective === 'connect-src' || e.violatedDirective === 'worker-src') {
            // If we get connect-src or worker-src violations, it likely means our CSP isn't applied correctly
            // or doesn't include necessary domains. Force refresh CSP.
            logger.info('Auto-refreshing CSP after violation');
            setTimeout(() => {
              initializeCSP(true);
            }, 100);
          }
        }
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
