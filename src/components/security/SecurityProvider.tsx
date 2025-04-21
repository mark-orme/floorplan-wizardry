
import React, { useEffect, useState } from 'react';
import { initializeAllSecurity } from '@/utils/security';
import { isEncryptionSupported } from '@/utils/security/encryption';
import { toast } from 'sonner';

interface SecurityProviderProps {
  children: React.ReactNode;
  showToasts?: boolean;
}

/**
 * Security Provider Component
 * Initializes all security features for the application
 */
export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
  showToasts = true
}) => {
  const [initialized, setInitialized] = useState(false);
  
  // Initialize security features
  useEffect(() => {
    try {
      // Initialize all security features
      initializeAllSecurity();
      
      // Check for encryption support
      const supportsEncryption = isEncryptionSupported();
      
      // Show toast notifications if enabled
      if (showToasts) {
        toast.success('Security features initialized', {
          id: 'security-initialized',
          duration: 3000
        });
        
        if (!supportsEncryption) {
          toast.warning('Secure storage is not supported in this browser', {
            id: 'encryption-warning',
            duration: 5000,
            description: 'Some security features may be limited'
          });
        }
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize security features:', error);
      
      if (showToasts) {
        toast.error('Failed to initialize security features', {
          id: 'security-error',
          duration: 5000,
          description: 'Some security features may be unavailable'
        });
      }
    }
  }, [showToasts]);
  
  return (
    <>
      {/* Fixed security headers - they would be invisible */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      
      {/* Render children once initialized */}
      {children}
    </>
  );
};

export default SecurityProvider;
