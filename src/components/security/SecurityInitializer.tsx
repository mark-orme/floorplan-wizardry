
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect, useState } from 'react';
import { initializeCSP, checkCSPApplied, fixSentryCSP } from '@/utils/security/contentSecurityPolicy';
import { applySecurityMetaTags } from '@/utils/security/httpSecurity';
import logger from '@/utils/logger';
import { toast } from 'sonner';

interface SecurityInitializerProps {
  forceRefresh?: boolean;
}

// Full CSP string with ALL possible domains needed
const FULL_CSP_STRING = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.lovable.dev https://*.lovable.dev https://o4508914471927808.ingest.de.sentry.io https://*.ingest.de.sentry.io https://*.ingest.sentry.io https://*.sentry.io https://sentry.io https://api.sentry.io https://ingest.sentry.io wss://ws-eu.pusher.com https://sockjs-eu.pusher.com wss://*.pusher.com https://*.pusher.com https://*.lovable.app ws: http://localhost:* http://*:* ws://*:*; frame-src 'self' https://*.lovable.dev https://*.lovable.app; object-src 'none'; base-uri 'self'; worker-src 'self' blob: 'unsafe-inline'; child-src 'self' blob:;";

/**
 * Apply direct CSP meta tag with all necessary domains
 * This is a simplified approach that applies the CSP directly
 */
export function applyFullCSP(): boolean {
  try {
    // Remove existing CSP meta tags
    const existingTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    existingTags.forEach(tag => tag.remove());
    
    // Create and apply new CSP meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = FULL_CSP_STRING;
    document.head.appendChild(meta);
    
    // Set data attribute to mark CSP as applied
    document.documentElement.setAttribute('data-csp-applied', 'true');
    document.documentElement.setAttribute('data-csp-timestamp', Date.now().toString());
    
    logger.info('Full CSP meta tag applied with ALL required domains');
    return true;
  } catch (error) {
    logger.error('Failed to apply full CSP meta tag', { error });
    return false;
  }
}

/**
 * Component that initializes security features
 * Should be rendered at the root level of the application
 */
export const SecurityInitializer = ({ forceRefresh = false }: SecurityInitializerProps) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Immediately apply the full CSP
    applyFullCSP();
    
    // Apply additional security headers
    applySecurityMetaTags();
    
    // Log initialization
    logger.info('Security features initialized from component');
    
    // Set up continuous CSP monitoring
    const monitorInterval = setInterval(() => {
      const hasValidCSP = checkCSPApplied();
      if (!hasValidCSP) {
        logger.warn('CSP validation failed during runtime check, reapplying');
        applyFullCSP();
        
        // Double-check after a brief delay
        setTimeout(() => {
          if (checkCSPApplied()) {
            logger.info('CSP successfully reapplied');
          } else {
            logger.error('Failed to reapply CSP after monitoring check');
            // Try one more time with the direct method
            applyFullCSP();
          }
        }, 200);
      }
    }, 2000);
    
    // Set up security violation handler
    const handleSecurityViolation = (e: SecurityPolicyViolationEvent) => {
      if (e.blockedURI.includes('sentry.io') || 
          e.blockedURI.includes('ingest.sentry.io') ||
          e.blockedURI.includes('ingest.de.sentry.io')) {
        logger.warn('Sentry domain blocked by CSP, applying emergency fix', {
          domain: e.blockedURI,
          directive: e.violatedDirective
        });
        
        // Apply emergency fix
        applyFullCSP();
        
        // Force reload Sentry configuration
        if (typeof window !== 'undefined' && window.location) {
          // Set a flag to reload configuration on next page load 
          sessionStorage.setItem('reload_sentry_config', 'true');
        }
      }
      
      // Also check for Pusher-related blocks
      if (e.blockedURI.includes('pusher.com')) {
        logger.warn('Pusher domain blocked by CSP, applying emergency fix', {
          domain: e.blockedURI,
          directive: e.violatedDirective  
        });
        
        // Apply emergency fix
        applyFullCSP();
      }
    };
    
    window.addEventListener('securitypolicyviolation', handleSecurityViolation);
    
    // Show notification
    if (forceRefresh) {
      toast.info('Security policy updated');
    }
    
    return () => {
      clearInterval(monitorInterval);
      window.removeEventListener('securitypolicyviolation', handleSecurityViolation);
    };
  }, [forceRefresh]);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
