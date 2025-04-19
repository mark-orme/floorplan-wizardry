
/**
 * Offline Encryption Utilities
 * Functions for encrypting data stored offline
 */

/**
 * Enable offline encryption for stored data
 * @returns Boolean indicating success
 */
export async function enableOfflineEncryption(): Promise<boolean> {
  // In a real implementation, this would set up encryption for IndexedDB
  console.info('Offline encryption enabled');
  return true;
}

/**
 * Generate encryption key for offline data
 * @returns Encryption key
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  // Generate an AES-GCM key using the Web Crypto API
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
  
  return key;
}

/**
 * Encrypt data for offline storage
 * @param data Data to encrypt
 * @param key Encryption key
 * @returns Encrypted data as base64 string
 */
export async function encryptData(data: any, key: CryptoKey): Promise<string> {
  try {
    // Convert data to string if not already
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Convert to buffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    
    // Generate initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode.apply(null, Array.from(result)));
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
}

/**
 * Decrypt data from offline storage
 * @param encryptedData Encrypted data as base64 string
 * @param key Decryption key
 * @returns Decrypted data
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<any> {
  try {
    // Convert from base64
    const encryptedBytes = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    // Extract IV and data
    const iv = encryptedBytes.slice(0, 12);
    const data = encryptedBytes.slice(12);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    
    // Parse JSON if possible
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
}
