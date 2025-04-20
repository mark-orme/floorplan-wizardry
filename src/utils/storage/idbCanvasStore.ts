
/**
 * IndexedDB Canvas Storage
 * 
 * Provides functions for saving and loading canvas data to/from IndexedDB
 */

// Database and store names
const DB_NAME = 'floorplan-app-db';
const CANVAS_STORE = 'canvas-state';
const DB_VERSION = 1;

/**
 * Initialize the IndexedDB database
 * @returns Promise resolving to an IDBDatabase instance
 */
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject(new Error('Failed to open IndexedDB database'));
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create canvas state store
      if (!db.objectStoreNames.contains(CANVAS_STORE)) {
        db.createObjectStore(CANVAS_STORE, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Save canvas data to IndexedDB
 * @param key Unique identifier for the canvas data
 * @param canvasData Canvas data to store
 * @returns Promise resolving to boolean indicating success
 */
export const saveCanvasToIDB = async (key: string, canvasData: any): Promise<boolean> => {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CANVAS_STORE], 'readwrite');
      const store = transaction.objectStore(CANVAS_STORE);
      
      const request = store.put({
        key,
        data: canvasData,
        timestamp: new Date().toISOString()
      });
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error saving canvas data:', event);
        reject(new Error('Failed to save canvas data'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in saveCanvasToIDB:', error);
    return false;
  }
};

/**
 * Load canvas data from IndexedDB
 * @param key Unique identifier for the canvas data
 * @returns Promise resolving to loaded canvas data or null if not found
 */
export const loadCanvasFromIDB = async (key: string): Promise<any> => {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CANVAS_STORE], 'readonly');
      const store = transaction.objectStore(CANVAS_STORE);
      
      const request = store.get(key);
      
      request.onsuccess = (event) => {
        const record = (event.target as IDBRequest).result;
        if (record) {
          resolve(record.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error loading canvas data:', event);
        reject(new Error('Failed to load canvas data'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in loadCanvasFromIDB:', error);
    return null;
  }
};

/**
 * Clear saved canvas data
 * @param key Unique identifier for the canvas data
 * @returns Promise resolving to boolean indicating success
 */
export const clearSavedCanvas = async (key: string): Promise<boolean> => {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CANVAS_STORE], 'readwrite');
      const store = transaction.objectStore(CANVAS_STORE);
      
      const request = store.delete(key);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error clearing canvas data:', event);
        reject(new Error('Failed to clear canvas data'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in clearSavedCanvas:', error);
    return false;
  }
};

/**
 * List all saved canvas keys
 * @returns Promise resolving to array of canvas keys
 */
export const listSavedCanvasKeys = async (): Promise<string[]> => {
  try {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([CANVAS_STORE], 'readonly');
      const store = transaction.objectStore(CANVAS_STORE);
      
      const request = store.getAllKeys();
      
      request.onsuccess = (event) => {
        const keys = (event.target as IDBRequest).result;
        resolve(keys as string[]);
      };
      
      request.onerror = (event) => {
        console.error('Error listing canvas keys:', event);
        reject(new Error('Failed to list canvas keys'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in listSavedCanvasKeys:', error);
    return [];
  }
};
