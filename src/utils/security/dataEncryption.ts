
/**
 * Data Encryption Utilities using Web Crypto API
 * Provides functions for encrypting and decrypting data
 */

/**
 * Check if the Web Crypto API is supported in this environment
 */
export function isEncryptionSupported(): boolean {
  return typeof window !== 'undefined' && 
         window.crypto && 
         window.crypto.subtle && 
         typeof window.crypto.subtle.generateKey === 'function';
}

/**
 * Generate an encryption key from a passphrase
 * @param passphrase String to derive key from
 * @returns Promise resolving to a CryptoKey
 */
export async function generateEncryptionKey(passphrase: string): Promise<CryptoKey> {
  // Convert passphrase to bytes
  const encoder = new TextEncoder();
  const passphraseBytes = encoder.encode(passphrase);
  
  // Create a key from the passphrase
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passphraseBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Generate a strong key using PBKDF2
  const salt = encoder.encode('secure-floorplan-app-salt');
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-GCM
 * @param data Data to encrypt
 * @param key CryptoKey to use for encryption
 * @returns Promise resolving to encrypted data object
 */
export async function encryptData(data: any, key: CryptoKey): Promise<{
  iv: string;
  data: string;
}> {
  // Create initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Convert data to string and then to bytes
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(JSON.stringify(data));
  
  // Encrypt the data
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    dataBytes
  );
  
  // Convert encrypted data and IV to Base64 strings for storage
  return {
    iv: bufferToBase64(iv),
    data: bufferToBase64(encryptedData)
  };
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedData Encrypted data object
 * @param key CryptoKey to use for decryption
 * @returns Promise resolving to decrypted data
 */
export async function decryptData(
  encryptedData: { iv: string; data: string },
  key: CryptoKey
): Promise<any> {
  // Convert Base64 strings back to buffers
  const iv = base64ToBuffer(encryptedData.iv);
  const data = base64ToBuffer(encryptedData.data);
  
  // Decrypt the data
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    data
  );
  
  // Convert bytes back to string and parse JSON
  const decoder = new TextDecoder();
  const decodedData = decoder.decode(decryptedData);
  return JSON.parse(decodedData);
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
