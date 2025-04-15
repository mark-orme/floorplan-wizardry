
import { openDB } from 'idb';

/**
 * Mock implementation for saving canvas to IndexedDB
 * Used for testing the autosave functionality
 */
export const saveCanvasToIDB = async (key: string, json: object): Promise<boolean> => {
  try {
    // In a real environment, this would use IndexedDB
    // For tests, we'll use localStorage as a substitute
    // but the real implementation would use our openDB instance
    localStorage.setItem(key, JSON.stringify(json));
    console.log(`[Mock] Canvas state saved to IDB with key: ${key}`);
    return true;
  } catch (error) {
    console.error('[Mock] Error saving canvas to IDB:', error);
    return false;
  }
};

/**
 * Mock implementation for loading canvas from IndexedDB
 * Used for testing the autosave functionality
 */
export const loadCanvasFromIDB = async (key: string): Promise<any> => {
  try {
    // In a real environment, this would use IndexedDB
    // For tests, we'll use localStorage as a substitute
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    return JSON.parse(raw);
  } catch (error) {
    console.error('[Mock] Error loading canvas from IDB:', error);
    return null;
  }
};

/**
 * Mock implementation for clearing canvas from IndexedDB
 * Used for testing the autosave functionality
 */
export const clearCanvasFromIDB = async (key: string): Promise<boolean> => {
  try {
    localStorage.removeItem(key);
    console.log(`[Mock] Canvas state with key ${key} cleared from IDB`);
    return true;
  } catch (error) {
    console.error('[Mock] Error clearing canvas from IDB:', error);
    return false;
  }
};

/**
 * Create a mock DB instance for testing
 * This simulates the openDB API but uses in-memory storage
 */
export const createMockIDBStore = () => {
  const store = new Map<string, any>();
  
  return {
    put: async (storeName: string, value: any, key: string) => {
      store.set(`${storeName}_${key}`, value);
      return key;
    },
    get: async (storeName: string, key: string) => {
      return store.get(`${storeName}_${key}`) || null;
    },
    delete: async (storeName: string, key: string) => {
      return store.delete(`${storeName}_${key}`);
    },
    getAll: async (storeName: string) => {
      return Array.from(store.entries())
        .filter(([k]) => k.startsWith(`${storeName}_`))
        .map(([_, v]) => v);
    },
    getAllKeys: async (storeName: string) => {
      return Array.from(store.keys())
        .filter(k => k.startsWith(`${storeName}_`))
        .map(k => k.replace(`${storeName}_`, ''));
    },
    clear: async (storeName: string) => {
      Array.from(store.keys())
        .filter(k => k.startsWith(`${storeName}_`))
        .forEach(k => store.delete(k));
    }
  };
};
