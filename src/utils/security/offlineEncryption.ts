
/**
 * Offline Encryption Utilities
 * Provides encryption for sensitive data stored offline
 */

import { generateEncryptionKey, encryptData, decryptData, isEncryptionSupported } from './dataEncryption';

// Default passphrase - in production, this should be more securely managed
const DEFAULT_PASSPHRASE = 'floor-plan-app-secure-storage';

// Store for encryption keys
let encryptionKey: CryptoKey | null = null;

/**
 * Enable offline encryption for the application
 * @returns Promise resolving to success status
 */
export async function enableOfflineEncryption(): Promise<boolean> {
  if (!isEncryptionSupported()) {
    console.warn('Encryption not supported in this environment');
    return false;
  }
  
  try {
    // Generate encryption key from default passphrase
    encryptionKey = await generateEncryptionKey(DEFAULT_PASSPHRASE);
    return true;
  } catch (error) {
    console.error('Failed to initialize offline encryption:', error);
    return false;
  }
}

/**
 * Encrypt data for offline storage
 * @param data Data to encrypt
 * @returns Promise resolving to encrypted data
 */
export async function encryptOfflineData(data: any): Promise<string | null> {
  if (!encryptionKey) {
    try {
      await enableOfflineEncryption();
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      return null;
    }
  }
  
  if (!encryptionKey) {
    console.error('Encryption key not available');
    return null;
  }
  
  try {
    const encrypted = await encryptData(data, encryptionKey);
    return JSON.stringify(encrypted);
  } catch (error) {
    console.error('Failed to encrypt data:', error);
    return null;
  }
}

/**
 * Decrypt data from offline storage
 * @param encryptedString Encrypted data string
 * @returns Promise resolving to decrypted data
 */
export async function decryptOfflineData(encryptedString: string): Promise<any | null> {
  if (!encryptionKey) {
    try {
      await enableOfflineEncryption();
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      return null;
    }
  }
  
  if (!encryptionKey) {
    console.error('Encryption key not available');
    return null;
  }
  
  try {
    const encrypted = JSON.parse(encryptedString);
    return await decryptData(encrypted, encryptionKey);
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return null;
  }
}
