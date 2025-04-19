
/**
 * SecurityInitializer Component
 * Initializes security features when the application loads
 */
import { useEffect } from 'react';
import { Security } from '@/utils/security';
import logger from '@/utils/logger';

export const SecurityInitializer = () => {
  useEffect(() => {
    try {
      // Initialize security features
      Security.initialize();
      
      // Apply security meta tags
      if (typeof document !== 'undefined') {
        // Add Content-Security-Policy meta tag
        let cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!cspTag) {
          cspTag = document.createElement('meta');
          cspTag.setAttribute('http-equiv', 'Content-Security-Policy');
          cspTag.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co https://*.sentry.io");
          document.head.appendChild(cspTag);
        }
        
        // Add X-Content-Type-Options meta tag
        let xctoTag = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
        if (!xctoTag) {
          xctoTag = document.createElement('meta');
          xctoTag.setAttribute('http-equiv', 'X-Content-Type-Options');
          xctoTag.setAttribute('content', 'nosniff');
          document.head.appendChild(xctoTag);
        }
        
        // Add Referrer-Policy meta tag
        let referrerTag = document.querySelector('meta[name="referrer"]');
        if (!referrerTag) {
          referrerTag = document.createElement('meta');
          referrerTag.setAttribute('name', 'referrer');
          referrerTag.setAttribute('content', 'strict-origin-when-cross-origin');
          document.head.appendChild(referrerTag);
        }
      }
      
      logger.info('Security features initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize security features', { error });
    }
    
    return () => {
      // Clean up if needed
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
