
import React, { useEffect } from 'react';
import { initializeCSRFProtection } from '@/utils/security/csrfHandler';
import { toast } from 'sonner';

/**
 * Component to initialize security features
 * Include this component at the top level of your application
 */
export const SecurityInitializer: React.FC = () => {
  useEffect(() => {
    try {
      // Initialize CSRF protection
      initializeCSRFProtection();
      
      // Add CSP header (as a meta tag since we can't modify HTTP headers directly)
      if (typeof document !== 'undefined' && !document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'";
        document.head.appendChild(cspMeta);
        
        // Also add other security headers
        const nosniffMeta = document.createElement('meta');
        nosniffMeta.httpEquiv = 'X-Content-Type-Options';
        nosniffMeta.content = 'nosniff';
        document.head.appendChild(nosniffMeta);
        
        const xssMeta = document.createElement('meta');
        xssMeta.httpEquiv = 'X-XSS-Protection';
        xssMeta.content = '1; mode=block';
        document.head.appendChild(xssMeta);
        
        const frameMeta = document.createElement('meta');
        frameMeta.httpEquiv = 'X-Frame-Options';
        frameMeta.content = 'DENY';
        document.head.appendChild(frameMeta);
      }
      
      console.log('Security features initialized');
    } catch (error) {
      console.error('Failed to initialize security features:', error);
      toast.error('Security initialization failed');
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default SecurityInitializer;
