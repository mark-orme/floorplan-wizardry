
/**
 * SecurityProvider Component
 * 
 * Initializes all security features and provides security context
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeSecurity } from '@/utils/security';
import { toast } from 'sonner';

interface SecurityContextType {
  isInitialized: boolean;
  securityLevel: 'high' | 'medium' | 'low';
  encryptionAvailable: boolean;
  csrfProtectionEnabled: boolean;
}

const SecurityContext = createContext<SecurityContextType>({
  isInitialized: false,
  securityLevel: 'medium',
  encryptionAvailable: false,
  csrfProtectionEnabled: false
});

export const useSecurity = () => useContext(SecurityContext);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [securityState, setSecurityState] = useState<SecurityContextType>({
    isInitialized: false,
    securityLevel: 'medium',
    encryptionAvailable: false,
    csrfProtectionEnabled: false
  });

  useEffect(() => {
    let mounted = true;

    const initSecurity = async () => {
      try {
        // Initialize security features
        initializeSecurity();
        
        // Check encryption support
        const encryptionSupported = typeof window !== 'undefined' && 
          window.crypto && 
          window.crypto.subtle && 
          typeof window.crypto.subtle.generateKey === 'function';
        
        // Update security state
        if (mounted) {
          setSecurityState({
            isInitialized: true,
            securityLevel: encryptionSupported ? 'high' : 'medium',
            encryptionAvailable: encryptionSupported,
            csrfProtectionEnabled: true
          });
        }
      } catch (error) {
        console.error('Failed to initialize security features:', error);
        
        // Update security state with fallback values
        if (mounted) {
          setSecurityState({
            isInitialized: true,
            securityLevel: 'low',
            encryptionAvailable: false,
            csrfProtectionEnabled: true
          });
          
          toast.error('Security initialization failed', {
            description: 'Some security features may be unavailable.',
            duration: 5000
          });
        }
      }
    };

    initSecurity();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SecurityContext.Provider value={securityState}>
      {children}
    </SecurityContext.Provider>
  );
}
