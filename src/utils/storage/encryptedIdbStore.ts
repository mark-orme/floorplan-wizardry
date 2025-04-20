
/**
 * Encrypted IndexedDB Store
 * 
 * Provides encrypted storage for sensitive data using the Web Crypto API
 */
import { encryptData, decryptData, generateEncryptionKey } from '../security/dataEncryption';
import { getEncryptionKey } from '../security/securityInit';
import logger from '@/utils/logger';

// Database name and store name
const DB_NAME = 'secure_floor_app';
const STORE_NAME = 'encrypted_data';

/**
 * Initialize the database and create object stores
 * @returns Promise resolving to the database instance
 */
async function getDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = (event) => {
      logger.error('Error opening database:', event);
      reject(new Error('Failed to open database'));
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        logger.info('Created encrypted data store');
      }
    };
  });
}

/**
 * Get or generate the encryption key
 * @returns Promise resolving to the encryption key
 */
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  // First try to get the global key from security init
  const globalKey = getEncryptionKey();
  if (globalKey) {
    return globalKey;
  }
  
  try {
    // Use a static passphrase for now
    // In a real app, this would be a secure user-specific key
    const passphrase = 'secure-floor-plan-app';
    
    return await generateEncryptionKey(passphrase);
  } catch (error) {
    logger.error('Error generating encryption key:', error);
    throw new Error('Failed to generate encryption key');
  }
}

/**
 * Save encrypted data to IndexedDB
 * @param key Storage key
 * @param data Data to store
 * @returns Promise resolving to boolean indicating success
 */
export async function saveEncrypted(key: string, data: any): Promise<boolean> {
  try {
    const db = await getDatabase();
    const cryptoKey = await getOrCreateEncryptionKey();
    
    // Encrypt the data
    const encryptedData = await encryptData(data, cryptoKey);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put({
        key,
        data: encryptedData,
        timestamp: new Date().toISOString()
      });
      
      request.onsuccess = () => {
        logger.debug(`Saved encrypted data with key: ${key}`);
        resolve(true);
      };
      
      request.onerror = (event) => {
        logger.error('Error saving encrypted data:', event);
        reject(new Error('Failed to save encrypted data'));
      };
    });
  } catch (error) {
    logger.error('Error in saveEncrypted:', error);
    return false;
  }
}

/**
 * Load encrypted data from IndexedDB
 * @param key Storage key
 * @returns Promise resolving to the decrypted data or null if not found
 */
export async function loadEncrypted(key: string): Promise<any> {
  try {
    const db = await getDatabase();
    const cryptoKey = await getOrCreateEncryptionKey();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get(key);
      
      request.onsuccess = async (event) => {
        const result = (event.target as IDBRequest).result;
        
        if (!result) {
          logger.debug(`No data found for key: ${key}`);
          resolve(null);
          return;
        }
        
        try {
          // Decrypt the data
          const decryptedData = await decryptData(result.data, cryptoKey);
          resolve(decryptedData);
        } catch (error) {
          logger.error('Error decrypting data:', error);
          reject(new Error('Failed to decrypt data'));
        }
      };
      
      request.onerror = (event) => {
        logger.error('Error loading encrypted data:', event);
        reject(new Error('Failed to load encrypted data'));
      };
    });
  } catch (error) {
    logger.error('Error in loadEncrypted:', error);
    return null;
  }
}

/**
 * Delete encrypted data from IndexedDB
 * @param key Storage key
 * @returns Promise resolving to boolean indicating success
 */
export async function deleteEncrypted(key: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.delete(key);
      
      request.onsuccess = () => {
        logger.debug(`Deleted encrypted data with key: ${key}`);
        resolve(true);
      };
      
      request.onerror = (event) => {
        logger.error('Error deleting encrypted data:', event);
        reject(new Error('Failed to delete encrypted data'));
      };
    });
  } catch (error) {
    logger.error('Error in deleteEncrypted:', error);
    return false;
  }
}

/**
 * List all encrypted keys
 * @returns Promise resolving to array of keys
 */
export async function listEncryptedKeys(): Promise<string[]> {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.getAllKeys();
      
      request.onsuccess = (event) => {
        const keys = (event.target as IDBRequest).result as string[];
        resolve(keys);
      };
      
      request.onerror = (event) => {
        logger.error('Error listing encrypted keys:', event);
        reject(new Error('Failed to list encrypted keys'));
      };
    });
  } catch (error) {
    logger.error('Error in listEncryptedKeys:', error);
    return [];
  }
}
