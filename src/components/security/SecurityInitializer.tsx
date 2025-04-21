
import React, { useEffect } from 'react';
import { initializeCsrfProtection, getCsrfToken } from '@/utils/security/csrfProtection';
import { initializeCSP } from '@/utils/security/cspUtils';
import { toast } from 'sonner';

interface SecurityInitializerProps {
  enableToasts?: boolean;
}

/**
 * Component to initialize security features
 * Include this component at the top level of your application
 */
export const SecurityInitializer: React.FC<SecurityInitializerProps> = ({ 
  enableToasts = true 
}) => {
  useEffect(() => {
    try {
      // Initialize CSRF protection with double-submit cookie verification
      initializeCsrfProtection();
      
      // Initialize Content Security Policy with secure defaults
      initializeCSP();
      
      // Generate CSRF meta tag for forms
      if (typeof document !== 'undefined' && !document.querySelector('meta[name="csrf-token"]')) {
        const token = getCsrfToken();
        const csrfMeta = document.createElement('meta');
        csrfMeta.name = 'csrf-token';
        csrfMeta.content = token;
        document.head.appendChild(csrfMeta);
      }
      
      // Log success and notify user
      console.log('Enhanced security features initialized');
      if (enableToasts) {
        toast.success('Security protections active', {
          description: 'CSRF and CSP protections enabled',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Failed to initialize security features:', error);
      if (enableToasts) {
        toast.error('Security initialization failed', {
          description: 'Please refresh the page',
          duration: 5000
        });
      }
    }
  }, [enableToasts]);
  
  // This component doesn't render anything visible
  return null;
};

export default SecurityInitializer;
