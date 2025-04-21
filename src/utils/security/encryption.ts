
/**
 * Encryption Utilities
 * Provides client-side encryption functionality for sensitive data
 */

// Check if the browser supports the necessary crypto APIs
export const isEncryptionSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.crypto &&
    window.crypto.subtle &&
    typeof window.TextEncoder !== 'undefined' &&
    typeof window.TextDecoder !== 'undefined'
  );
};

// Generate a new encryption key
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  if (!isEncryptionSupported()) {
    throw new Error('Encryption is not supported in this browser');
  }

  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
};

// Export key to string format for storage
export const exportKey = async (key: CryptoKey): Promise<string> => {
  if (!isEncryptionSupported()) {
    throw new Error('Encryption is not supported in this browser');
  }

  const exported = await window.crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
};

// Import key from string format
export const importKey = async (keyData: string): Promise<CryptoKey> => {
  if (!isEncryptionSupported()) {
    throw new Error('Encryption is not supported in this browser');
  }

  const keyBuffer = base64ToArrayBuffer(keyData);
  
  return window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data
export const encryptData = async (
  data: string,
  key: CryptoKey
): Promise<string> => {
  if (!isEncryptionSupported()) {
    throw new Error('Encryption is not supported in this browser');
  }

  // Generate a random IV for this encryption
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encode the data
  const encodedData = new TextEncoder().encode(data);
  
  // Encrypt the data
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encodedData
  );
  
  // Combine IV and encrypted data for storage
  const combinedData = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combinedData.set(iv);
  combinedData.set(new Uint8Array(encryptedBuffer), iv.length);
  
  // Convert to base64 for storage
  return arrayBufferToBase64(combinedData);
};

// Decrypt data
export const decryptData = async (
  encryptedData: string,
  key: CryptoKey
): Promise<string> => {
  if (!isEncryptionSupported()) {
    throw new Error('Encryption is not supported in this browser');
  }

  // Convert from base64
  const combinedData = base64ToArrayBuffer(encryptedData);
  
  // Extract IV and encrypted data
  const iv = combinedData.slice(0, 12);
  const encryptedBuffer = combinedData.slice(12);
  
  // Decrypt the data
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv)
    },
    key,
    encryptedBuffer
  );
  
  // Decode and return the result
  return new TextDecoder().decode(decryptedBuffer);
};

// Helper: Convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

// Helper: Convert Base64 string to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Generate a secure password hash (for local verification only)
export const generatePasswordHash = async (password: string, salt?: string): Promise<string> => {
  if (!isEncryptionSupported()) {
    throw new Error('Cryptographic functions not supported in this browser');
  }

  // Generate a salt if not provided
  const useSalt = salt || arrayBufferToBase64(window.crypto.getRandomValues(new Uint8Array(16)));
  
  // Encode password with salt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + useSalt);
  
  // Hash the password
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  
  // Convert to base64
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return salt + hash
  return `${useSalt}:${hashHex}`;
};

// Verify a password against a hash
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  
  const newHash = await generatePasswordHash(password, salt);
  return newHash === storedHash;
};
