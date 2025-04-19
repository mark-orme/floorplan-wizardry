
import { useEffect } from 'react';
import { initializeSecurity } from '@/utils/security/SecurityUtils';

/**
 * Component to initialize security features on application startup
 */
export default function SecurityInitializer() {
  useEffect(() => {
    // Initialize security features
    initializeSecurity();
    
    // Log security initialization
    console.info('Security features initialized');
  }, []);
  
  // This component doesn't render anything
  return null;
}
