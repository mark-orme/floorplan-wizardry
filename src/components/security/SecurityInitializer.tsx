
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface SecurityInitializerProps {
  forceRefresh?: boolean;
}

// CSP string with all necessary domains
const FULL_CSP_STRING = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.lovable.dev https://*.lovable.dev https://o4508914471927808.ingest.de.sentry.io https://*.ingest.de.sentry.io https://*.ingest.sentry.io https://*.sentry.io https://sentry.io https://api.sentry.io https://ingest.sentry.io wss://ws-eu.pusher.com https://sockjs-eu.pusher.com wss://*.pusher.com https://*.pusher.com https://*.lovable.app ws: http://localhost:* http://*:* ws://*:*; frame-src 'self' https://*.lovable.dev https://*.lovable.app; object-src 'none'; base-uri 'self'; worker-src 'self' blob: 'unsafe-inline'; child-src 'self' blob:;";

/**
 * Apply CSP meta tag with all necessary domains
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
    
    logger.info('Full CSP meta tag applied with required domains');
    return true;
  } catch (error) {
    logger.error('Failed to apply full CSP meta tag', { error });
    return false;
  }
}

/**
 * Apply security meta tags except X-Frame-Options
 */
export function applySecurityMetaTags(): boolean {
  try {
    // X-Content-Type-Options
    let xctoTag = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    if (!xctoTag) {
      xctoTag = document.createElement('meta');
      xctoTag.setAttribute('http-equiv', 'X-Content-Type-Options');
      xctoTag.setAttribute('content', 'nosniff');
      document.head.appendChild(xctoTag);
    }
    
    // Referrer-Policy
    let referrerTag = document.querySelector('meta[name="referrer"]');
    if (!referrerTag) {
      referrerTag = document.createElement('meta');
      referrerTag.setAttribute('name', 'referrer');
      referrerTag.setAttribute('content', 'strict-origin-when-cross-origin');
      document.head.appendChild(referrerTag);
    }
    
    // Note: X-Frame-Options cannot be set via meta tags
    
    logger.info('Security meta tags applied (except X-Frame-Options)');
    return true;
  } catch (error) {
    logger.error('Failed to apply security meta tags', { error });
    return false;
  }
}

/**
 * Component that initializes security features
 */
export const SecurityInitializer = ({ forceRefresh = false }: SecurityInitializerProps) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Apply the full CSP
    applyFullCSP();
    
    // Apply additional security headers (excluding X-Frame-Options)
    applySecurityMetaTags();
    
    // Log initialization
    logger.info('Security features initialized from component');
    
    // Set up continuous CSP monitoring
    const monitorInterval = setInterval(() => {
      const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!cspTag) {
        logger.warn('CSP validation failed during runtime check, reapplying');
        applyFullCSP();
      }
    }, 2000);
    
    // Set up security violation handler
    const handleSecurityViolation = (e: SecurityPolicyViolationEvent) => {
      logger.warn('Security policy violation', {
        blockedURI: e.blockedURI,
        directive: e.violatedDirective,
        documentURI: e.documentURI
      });
      
      // Apply emergency fix if needed domains are blocked
      if (e.blockedURI.includes('sentry.io') || 
          e.blockedURI.includes('pusher.com') ||
          e.blockedURI.includes('supabase.co')) {
        logger.warn('Critical domain blocked by CSP, applying emergency fix');
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
