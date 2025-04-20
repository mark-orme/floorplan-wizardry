
import { initializeEncryption } from '@/utils/storage/encryptedCanvasStore';
import { generateCSRFToken } from '@/utils/security/csrfProtection';
import { toast } from 'sonner';

let encryptionKey: CryptoKey | null = null;

/**
 * Initialize all security features for the application
 */
export async function initializeSecurity(): Promise<void> {
  try {
    console.info('Initializing security features...');
    
    // Set up CSRF protection
    if (typeof document !== 'undefined') {
      generateCSRFToken();
      console.info('CSRF protection initialized');
    }
    
    // Set up encryption
    const encryptionSupported = typeof window !== 'undefined' && 
                              window.crypto && 
                              window.crypto.subtle;
    
    if (encryptionSupported) {
      console.info('Web Crypto API is supported, initializing encryption...');
      // Initialization will happen when needed
    } else {
      console.warn('Web Crypto API is not supported in this browser');
      toast.warning('Secure storage not available in your browser', { 
        duration: 5000 
      });
    }
    
    // Apply security-related meta tags
    if (typeof document !== 'undefined') {
      // Set referrer policy
      const metaReferrer = document.createElement('meta');
      metaReferrer.setAttribute('name', 'referrer');
      metaReferrer.content = 'no-referrer';
      document.head.appendChild(metaReferrer);
      
      console.info('Security headers initialized');
    }
    
  } catch (error) {
    console.error('Error initializing security features:', error);
    toast.error('Failed to initialize security features');
  }
}

/**
 * Get the encryption key for use in other modules
 * @returns The global encryption key or null if not available
 */
export function getEncryptionKey(): CryptoKey | null {
  return encryptionKey;
}

/**
 * Set the global encryption key
 * @param key CryptoKey to set globally
 */
export function setEncryptionKey(key: CryptoKey): void {
  encryptionKey = key;
}
