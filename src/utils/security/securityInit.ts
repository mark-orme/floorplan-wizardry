
import { initializeEncryption } from '@/utils/storage/encryptedCanvasStore';
import { createFormProtection } from '@/utils/security/enhancedCsrfProtection';
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
      createFormProtection();
      console.info('CSRF protection initialized');
    }
    
    // Set up encryption
    const encryptionSuccess = await initializeEncryption();
    if (encryptionSuccess) {
      console.info('Encryption initialized successfully');
    } else {
      console.warn('Encryption initialization failed or is not supported');
    }
    
    // Apply security-related meta tags
    if (typeof document !== 'undefined') {
      // Set referrer policy
      const metaReferrer = document.createElement('meta');
      metaReferrer.setAttribute('name', 'referrer');
      metaReferrer.content = 'no-referrer';
      document.head.appendChild(metaReferrer);
      
      // Set content security policy
      const metaCsp = document.createElement('meta');
      metaCsp.setAttribute('http-equiv', 'Content-Security-Policy');
      metaCsp.content = "default-src 'self'; script-src 'self'; connect-src 'self' https://*.supabase.co; img-src 'self' data: blob:;";
      document.head.appendChild(metaCsp);
      
      console.info('Security headers initialized');
    }
    
    toast.success('Security features initialized', {
      duration: 3000,
      position: 'bottom-right'
    });
    
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

