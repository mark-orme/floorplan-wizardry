
import { useEffect } from 'react';
import { initializeSecurity } from '@/utils/security/securityInit';
import { isEncryptionSupported } from '@/utils/security/dataEncryption';
import { toast } from 'sonner';

/**
 * Component to initialize security features on application startup
 */
export default function SecurityInitializer() {
  useEffect(() => {
    // Initialize security features
    initializeSecurity();
    
    // Check if encryption is supported
    if (!isEncryptionSupported()) {
      console.warn('Web Crypto API not supported in this browser. Encrypted storage will not be available.');
      toast.warning('Secure storage is not supported in this browser.', {
        description: 'Some security features may be limited.',
        duration: 5000
      });
    } else {
      console.info('Encryption supported and initialized');
    }
    
    // Log security initialization
    console.info('Security features initialized');
  }, []);
  
  // This component doesn't render anything
  return null;
}

