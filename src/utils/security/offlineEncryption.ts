
/**
 * Enable encryption for offline/IndexedDB data
 */
export function enableOfflineEncryption(): void {
  console.info('Setting up offline data encryption...');
  
  // Initialize the encryption system
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    initializeEncryptionKey()
      .then(key => {
        console.info('Encryption key initialized successfully');
        return key;
      })
      .catch(err => {
        console.error('Failed to initialize encryption key:', err);
      });
  } else {
    console.warn('Web Crypto API not available - offline encryption disabled');
  }
}

/**
 * Initialize or retrieve the encryption key
 */
async function initializeEncryptionKey(): Promise<CryptoKey> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not available');
  }
  
  // Check if we already have a key
  const storedKeyData = localStorage.getItem('encryptionKeyData');
  
  if (storedKeyData) {
    // Key exists, import it
    try {
      const keyData = JSON.parse(storedKeyData);
      const keyBuffer = base64ToArrayBuffer(keyData.key);
      
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      );
      
      return key;
    } catch (error) {
      console.error('Failed to import stored encryption key, generating new one:', error);
      // Fall through to key generation
    }
  }
  
  // Generate a new key
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Export and store the key
    const rawKey = await window.crypto.subtle.exportKey('raw', key);
    const keyData = {
      key: arrayBufferToBase64(rawKey),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('encryptionKeyData', JSON.stringify(keyData));
    
    return key;
  } catch (error) {
    console.error('Failed to generate encryption key:', error);
    throw error;
  }
}

/**
 * Encrypt data using the encryption key
 */
export async function encryptData(data: any): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback when crypto not available
    console.warn('Encryption not available, using base64 obfuscation instead');
    return btoa(JSON.stringify(data));
  }
  
  try {
    const key = await initializeEncryptionKey();
    
    // Create an initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Convert data to ArrayBuffer
    const dataString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data, and convert to base64
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    return arrayBufferToBase64(combined);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

/**
 * Decrypt data using the encryption key
 */
export async function decryptData(encryptedData: string): Promise<any> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback when crypto not available
    console.warn('Decryption not available, using base64 deobfuscation instead');
    return JSON.parse(atob(encryptedData));
  }
  
  try {
    const key = await initializeEncryptionKey();
    
    // Convert base64 to ArrayBuffer
    const dataBuffer = base64ToArrayBuffer(encryptedData);
    
    // Extract IV (first 12 bytes) and encrypted data
    const iv = dataBuffer.slice(0, 12);
    const encryptedBuffer = dataBuffer.slice(12);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedBuffer
    );
    
    // Convert ArrayBuffer to string and then parse as JSON
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
}

/**
 * Helper: Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}

/**
 * Helper: Convert base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}
