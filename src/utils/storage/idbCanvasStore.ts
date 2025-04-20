
/**
 * IndexedDB Canvas Storage
 * Provides functions for storing and retrieving canvas data in IndexedDB
 */

// Define database details
const DB_NAME = 'floor_plan_db';
const STORE_NAME = 'canvas_data';
const DB_VERSION = 1;

// Get or create database
async function getDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening database:', event);
      reject(new Error('Failed to open database'));
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        console.info('Created canvas data store');
      }
    };
  });
}

/**
 * Save canvas data to IndexedDB
 * @param key Canvas identifier
 * @param data Canvas data to store
 */
export async function saveCanvasToIDB(key: string, data: any): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put({
        id: key,
        data,
        timestamp: new Date().toISOString()
      });
      
      request.onsuccess = () => {
        console.debug(`Saved canvas data with key: ${key}`);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error saving canvas data:', event);
        reject(new Error('Failed to save canvas data'));
      };
    });
  } catch (error) {
    console.error('Error in saveCanvasToIDB:', error);
    return false;
  }
}

/**
 * Load canvas data from IndexedDB
 * @param key Canvas identifier
 * @returns Canvas data or null if not found
 */
export async function loadCanvasFromIDB(key: string): Promise<any> {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get(key);
      
      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        
        if (!result) {
          console.debug(`No data found for key: ${key}`);
          resolve(null);
          return;
        }
        
        console.debug(`Loaded canvas data with key: ${key}`);
        resolve(result.data);
      };
      
      request.onerror = (event) => {
        console.error('Error loading canvas data:', event);
        reject(new Error('Failed to load canvas data'));
      };
    });
  } catch (error) {
    console.error('Error in loadCanvasFromIDB:', error);
    return null;
  }
}

/**
 * Clear saved canvas data
 * @param key Canvas identifier to clear
 */
export async function clearSavedCanvas(key: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.delete(key);
      
      request.onsuccess = () => {
        console.debug(`Cleared canvas data with key: ${key}`);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error clearing canvas data:', event);
        reject(new Error('Failed to clear canvas data'));
      };
    });
  } catch (error) {
    console.error('Error in clearSavedCanvas:', error);
    return false;
  }
}

/**
 * List all saved canvas keys
 */
export async function listSavedCanvasKeys(): Promise<string[]> {
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
        console.error('Error listing canvas keys:', event);
        reject(new Error('Failed to list canvas keys'));
      };
    });
  } catch (error) {
    console.error('Error in listSavedCanvasKeys:', error);
    return [];
  }
}
