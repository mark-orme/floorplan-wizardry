
/**
 * Client-side encryption utilities
 * Provides end-to-end encryption for sensitive floor plan data
 */
import logger from '@/utils/logger';

/**
 * Encryption options
 */
interface EncryptionOptions {
  algorithm?: string;
  keyLength?: number;
}

/**
 * Encrypted data format
 */
export interface EncryptedData {
  iv: string;
  data: string;
  authTag?: string;
  salt?: string;
}

/**
 * Generate a new encryption key from a password
 * @param password User password to derive key from
 * @param options Encryption options
 * @returns Promise resolving to CryptoKey
 */
export async function generateKeyFromPassword(
  password: string,
  options: EncryptionOptions = {}
): Promise<CryptoKey> {
  const { keyLength = 256 } = options;
  
  try {
    // Convert password to key material
    const enc = new TextEncoder();
    const passwordBuffer = enc.encode(password);
    
    // Generate a random salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    
    // Import key material
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Derive key using PBKDF2
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: keyLength },
      true,
      ['encrypt', 'decrypt']
    );
    
    return key;
  } catch (error) {
    logger.error('Failed to generate encryption key from password', { error });
    throw new Error('Encryption key generation failed');
  }
}

/**
 * Generate a random encryption key
 * @param options Encryption options
 * @returns Promise resolving to CryptoKey
 */
export async function generateEncryptionKey(
  options: EncryptionOptions = {}
): Promise<CryptoKey> {
  const { algorithm = 'AES-GCM', keyLength = 256 } = options;
  
  try {
    // Generate a new random key
    const key = await window.crypto.subtle.generateKey(
      {
        name: algorithm,
        length: keyLength
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
    
    return key;
  } catch (error) {
    logger.error('Failed to generate encryption key', { error });
    throw new Error('Encryption key generation failed');
  }
}

/**
 * Export encryption key to base64 string
 * @param key CryptoKey to export
 * @returns Promise resolving to base64 string
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  try {
    // Export raw key data
    const rawKey = await window.crypto.subtle.exportKey('raw', key);
    
    // Convert to base64
    const base64Key = btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(rawKey)))
    );
    
    return base64Key;
  } catch (error) {
    logger.error('Failed to export encryption key', { error });
    throw new Error('Key export failed');
  }
}

/**
 * Import encryption key from base64 string
 * @param keyData Base64 key string
 * @param options Encryption options
 * @returns Promise resolving to CryptoKey
 */
export async function importKey(
  keyData: string,
  options: EncryptionOptions = {}
): Promise<CryptoKey> {
  const { algorithm = 'AES-GCM', keyLength = 256 } = options;
  
  try {
    // Convert base64 to array buffer
    const rawData = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    
    // Import key
    const key = await window.crypto.subtle.importKey(
      'raw',
      rawData,
      {
        name: algorithm,
        length: keyLength
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
    
    return key;
  } catch (error) {
    logger.error('Failed to import encryption key', { error });
    throw new Error('Key import failed');
  }
}

/**
 * Encrypt data using AES-GCM
 * @param data Data to encrypt
 * @param key Encryption key
 * @returns Promise resolving to encrypted data
 */
export async function encryptData(
  data: string,
  key: CryptoKey
): Promise<EncryptedData> {
  try {
    // Generate a random initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encode data
    const enc = new TextEncoder();
    const dataBuffer = enc.encode(data);
    
    // Encrypt data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      dataBuffer
    );
    
    // Convert to base64
    const encryptedBase64 = btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedBuffer)))
    );
    
    // Convert IV to base64
    const ivBase64 = btoa(
      String.fromCharCode.apply(null, Array.from(iv))
    );
    
    return {
      iv: ivBase64,
      data: encryptedBase64
    };
  } catch (error) {
    logger.error('Failed to encrypt data', { error });
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedData Encrypted data
 * @param key Decryption key
 * @returns Promise resolving to decrypted string
 */
export async function decryptData(
  encryptedData: EncryptedData,
  key: CryptoKey
): Promise<string> {
  try {
    // Convert base64 to array buffer
    const encryptedBuffer = Uint8Array.from(
      atob(encryptedData.data), 
      c => c.charCodeAt(0)
    );
    
    // Convert IV from base64
    const iv = Uint8Array.from(
      atob(encryptedData.iv), 
      c => c.charCodeAt(0)
    );
    
    // Decrypt data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encryptedBuffer
    );
    
    // Decode data
    const dec = new TextDecoder();
    const decryptedData = dec.decode(decryptedBuffer);
    
    return decryptedData;
  } catch (error) {
    logger.error('Failed to decrypt data', { error });
    throw new Error('Decryption failed');
  }
}

/**
 * Encrypt floor plan JSON data
 * @param floorPlanData Floor plan data to encrypt
 * @param password User password or shared secret
 * @returns Promise resolving to encrypted data
 */
export async function encryptFloorPlan(
  floorPlanData: any,
  password: string
): Promise<EncryptedData> {
  try {
    // Convert data to JSON string
    const dataString = JSON.stringify(floorPlanData);
    
    // Generate key from password
    const key = await generateKeyFromPassword(password);
    
    // Encrypt data
    return encryptData(dataString, key);
  } catch (error) {
    logger.error('Failed to encrypt floor plan', { error });
    throw new Error('Floor plan encryption failed');
  }
}

/**
 * Decrypt floor plan JSON data
 * @param encryptedData Encrypted floor plan data
 * @param password User password or shared secret
 * @returns Promise resolving to decrypted floor plan data
 */
export async function decryptFloorPlan(
  encryptedData: EncryptedData,
  password: string
): Promise<any> {
  try {
    // Generate key from password
    const key = await generateKeyFromPassword(password);
    
    // Decrypt data
    const dataString = await decryptData(encryptedData, key);
    
    // Parse JSON
    return JSON.parse(dataString);
  } catch (error) {
    logger.error('Failed to decrypt floor plan', { error });
    throw new Error('Floor plan decryption failed');
  }
}
