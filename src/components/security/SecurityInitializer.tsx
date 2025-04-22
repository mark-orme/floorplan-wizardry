
import { useEffect } from 'react';
import { getCSRFToken } from '@/utils/security/csrfHandler';
import { initXssProtection } from '@/utils/security/xssProtection';

interface SecurityInitializerProps {
  enableCSRF?: boolean;
  enableXSSProtection?: boolean;
}

export const SecurityInitializer: React.FC<SecurityInitializerProps> = ({
  enableCSRF = true,
  enableXSSProtection = true
}) => {
  useEffect(() => {
    if (enableCSRF) {
      const token = getCSRFToken();
      console.log('CSRF protection initialized');
    }
    
    if (enableXSSProtection) {
      initXssProtection();
      console.log('XSS protection initialized');
    }
  }, [enableCSRF, enableXSSProtection]);
  
  return null;
};

// Export for accessibility test
export default SecurityInitializer;
