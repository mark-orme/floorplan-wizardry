
/**
 * Encrypted IndexedDB Storage
 * Provides encrypted storage for sensitive data in IndexedDB
 */

import { openDB } from 'idb';
import { generateEncryptionKey, encryptData, decryptData } from '@/utils/security/dataEncryption';
import logger from '@/utils/logger';

// Store name constants
const DB_NAME = 'encrypted-floorplan-db';
const STORE_NAME = 'encrypted-canvas-snapshots';
const META_STORE_NAME = 'metadata';

// Cache for encryption key to avoid repeated derivation
let encryptionKeyCache: CryptoKey | null = null;

/**
 * Get encryption key, generating if needed
 * @param appSecret Application secret or user-specific identifier
 * @returns Promise resolving to encryption key
 */
async function getEncryptionKey(appSecret: string): Promise<CryptoKey> {
  if (!encryptionKeyCache) {
    encryptionKeyCache = await generateEncryptionKey(appSecret);
  }
  return encryptionKeyCache;
}

/**
 * Initialize the encrypted database
 * @returns Promise resolving to IDBPDatabase
 */
export const getEncryptedDB = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(META_STORE_NAME)) {
        db.createObjectStore(META_STORE_NAME);
      }
    },
  });

/**
 * Save data to encrypted IndexedDB
 * @param key Unique identifier for the data
 * @param data Data object to encrypt and store
 * @param appSecret Application secret or user-specific identifier
 */
export async function saveEncrypted(key: string, data: any, appSecret: string): Promise<void> {
  try {
    const db = await getEncryptedDB();
    const encryptionKey = await getEncryptionKey(appSecret);
    
    // Encrypt the data
    const encrypted = await encryptData(data, encryptionKey);
    
    // Store encrypted data
    await db.put(STORE_NAME, encrypted, key);
    
    // Store metadata (creation time, last access)
    await db.put(META_STORE_NAME, {
      lastModified: new Date().toISOString(),
      size: JSON.stringify(data).length,
      encrypted: true
    }, `meta_${key}`);
    
    logger.info(`Encrypted data saved with key: ${key}`);
  } catch (error) {
    logger.error('Error saving encrypted data:', error);
    throw new Error('Failed to save encrypted data');
  }
}

/**
 * Load and decrypt data from IndexedDB
 * @param key Unique identifier for the data
 * @param appSecret Application secret or user-specific identifier
 * @returns Promise resolving to decrypted data or null if not found
 */
export async function loadEncrypted(key: string, appSecret: string): Promise<any> {
  try {
    const db = await getEncryptedDB();
    const encrypted = await db.get(STORE_NAME, key);
    
    if (!encrypted) {
      logger.warn(`No encrypted data found for key: ${key}`);
      return null;
    }
    
    // Update metadata
    await db.put(META_STORE_NAME, {
      lastAccessed: new Date().toISOString(),
      lastModified: (await db.get(META_STORE_NAME, `meta_${key}`))?.lastModified,
      encrypted: true
    }, `meta_${key}`);
    
    // Decrypt the data
    const encryptionKey = await getEncryptionKey(appSecret);
    return decryptData(encrypted, encryptionKey);
  } catch (error) {
    logger.error('Error loading encrypted data:', error);
    throw new Error('Failed to load encrypted data');
  }
}

/**
 * Delete encrypted data from IndexedDB
 * @param key Unique identifier for the data to delete
 */
export async function deleteEncrypted(key: string): Promise<void> {
  try {
    const db = await getEncryptedDB();
    
    // Delete the data and its metadata
    await db.delete(STORE_NAME, key);
    await db.delete(META_STORE_NAME, `meta_${key}`);
    
    logger.info(`Encrypted data deleted with key: ${key}`);
  } catch (error) {
    logger.error('Error deleting encrypted data:', error);
    throw new Error('Failed to delete encrypted data');
  }
}

/**
 * List all encrypted data keys
 * @returns Promise resolving to array of keys
 */
export async function listEncryptedKeys(): Promise<string[]> {
  try {
    const db = await getEncryptedDB();
    return db.getAllKeys(STORE_NAME) as Promise<string[]>;
  } catch (error) {
    logger.error('Error listing encrypted keys:', error);
    return [];
  }
}

/**
 * Get metadata for all stored encrypted items
 * @returns Promise resolving to metadata object
 */
export async function getEncryptedMetadata(): Promise<Record<string, any>> {
  try {
    const db = await getEncryptedDB();
    const keys = await db.getAllKeys(META_STORE_NAME);
    
    const metadata: Record<string, any> = {};
    for (const key of keys) {
      const meta = await db.get(META_STORE_NAME, key);
      if (key.toString().startsWith('meta_')) {
        metadata[key.toString().substring(5)] = meta;
      }
    }
    
    return metadata;
  } catch (error) {
    logger.error('Error getting encrypted metadata:', error);
    return {};
  }
}
