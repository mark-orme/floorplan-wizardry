
/**
 * Data Encryption Utilities
 * Provides functions for encrypting and decrypting data using Web Crypto API
 */

/**
 * Generate an encryption key from a passphrase
 * @param passphrase String to generate key from
 * @returns Promise resolving to CryptoKey
 */
export async function generateEncryptionKey(passphrase: string): Promise<CryptoKey> {
  // Convert passphrase to bytes
  const encoder = new TextEncoder();
  const passphraseBytes = encoder.encode(passphrase);
  
  // Create a key using PBKDF2
  const salt = encoder.encode('floor-plan-app-salt');
  const importedKey = await window.crypto.subtle.importKey(
    'raw',
    passphraseBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive an AES-GCM key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-GCM
 * @param data Data to encrypt
 * @param key CryptoKey to use for encryption
 * @returns Promise resolving to encrypted data
 */
export async function encryptData(data: any, key: CryptoKey): Promise<{
  iv: string;
  encryptedData: string;
}> {
  try {
    // Generate an initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Convert data to string if it's not already
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Convert to bytes
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(dataStr);
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      dataBytes
    );
    
    // Convert to base64 strings for storage
    const encryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
    const ivString = btoa(String.fromCharCode(...iv));
    
    return {
      iv: ivString,
      encryptedData
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedData Object containing IV and encrypted data
 * @param key CryptoKey to use for decryption
 * @returns Promise resolving to decrypted data
 */
export async function decryptData(
  encryptedData: { iv: string; encryptedData: string },
  key: CryptoKey
): Promise<any> {
  try {
    // Convert base64 strings back to bytes
    const iv = new Uint8Array(
      [...atob(encryptedData.iv)].map(char => char.charCodeAt(0))
    );
    
    const encryptedBytes = new Uint8Array(
      [...atob(encryptedData.encryptedData)].map(char => char.charCodeAt(0))
    );
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encryptedBytes
    );
    
    // Convert bytes to string
    const decoder = new TextDecoder();
    const decryptedStr = decoder.decode(decryptedBuffer);
    
    // Parse JSON if the decrypted data is JSON
    try {
      return JSON.parse(decryptedStr);
    } catch {
      // If not valid JSON, return the string as is
      return decryptedStr;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Test if Web Crypto API is available
 * @returns Boolean indicating if encryption is supported
 */
export function isEncryptionSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.crypto !== 'undefined' && 
         typeof window.crypto.subtle !== 'undefined';
}
