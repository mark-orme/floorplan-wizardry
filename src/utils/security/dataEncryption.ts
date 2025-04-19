
/**
 * Data Encryption Utilities
 * Provides functions for encrypting and decrypting data using Web Crypto API
 */

/**
 * Generate a cryptographic key for encryption/decryption
 * @param password User password or application secret
 * @returns Promise resolving to CryptoKey
 */
export async function generateEncryptionKey(password: string): Promise<CryptoKey> {
  // Convert password string to buffer
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  
  // Create a key from the password using PBKDF2
  const salt = encoder.encode('secure-floor-plan-data');
  const importedKey = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive a key for AES-GCM
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
 * @param key Encryption key
 * @returns Promise resolving to encrypted data object
 */
export async function encryptData(data: any, key: CryptoKey): Promise<{
  iv: string;
  encryptedData: string;
}> {
  // Generate initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Convert data to string then to buffer
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  
  // Encrypt the data
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  // Convert encrypted data and IV to base64 strings
  return {
    iv: arrayBufferToBase64(iv),
    encryptedData: arrayBufferToBase64(encryptedBuffer)
  };
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedData Encrypted data object
 * @param key Decryption key
 * @returns Promise resolving to decrypted data
 */
export async function decryptData(
  encryptedData: { iv: string; encryptedData: string },
  key: CryptoKey
): Promise<any> {
  // Convert base64 strings back to buffers
  const iv = base64ToArrayBuffer(encryptedData.iv);
  const encryptedBuffer = base64ToArrayBuffer(encryptedData.encryptedData);
  
  // Decrypt the data
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedBuffer
  );
  
  // Convert buffer to string then parse JSON
  const decoder = new TextDecoder();
  const decryptedString = decoder.decode(decryptedBuffer);
  
  return JSON.parse(decryptedString);
}

/**
 * Convert ArrayBuffer to Base64 string
 * @param buffer ArrayBuffer to convert
 * @returns Base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return window.btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 * @param base64 Base64 string to convert
 * @returns ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}
