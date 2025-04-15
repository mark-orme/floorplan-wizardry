
import { openDB } from 'idb';

const DB_NAME = 'floorplan-history';
const STORE_NAME = 'history';

/**
 * Get or create the IndexedDB database for history storage
 */
const getHistoryDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

/**
 * Save canvas history to IndexedDB
 * @param key Unique identifier for the history entry
 * @param data Array of history snapshots
 * @returns Promise that resolves when save is complete
 */
export const saveCanvasHistory = async (key: string, data: string[]): Promise<void> => {
  try {
    const db = await getHistoryDB();
    await db.put(STORE_NAME, data, key);
    console.log(`History saved with key: ${key}`);
  } catch (error) {
    console.error('Error saving history to IndexedDB:', error);
    throw error;
  }
};

/**
 * Load canvas history from IndexedDB
 * @param key Unique identifier for the history entry
 * @returns Promise that resolves with the history array or null if not found
 */
export const loadCanvasHistory = async (key: string): Promise<string[] | null> => {
  try {
    const db = await getHistoryDB();
    return await db.get(STORE_NAME, key);
  } catch (error) {
    console.error('Error loading history from IndexedDB:', error);
    throw error;
  }
};

/**
 * Clear canvas history from IndexedDB
 * @param key Unique identifier for the history entry
 * @returns Promise that resolves when delete is complete
 */
export const clearCanvasHistory = async (key: string): Promise<void> => {
  try {
    const db = await getHistoryDB();
    await db.delete(STORE_NAME, key);
    console.log(`History cleared for key: ${key}`);
  } catch (error) {
    console.error('Error clearing history from IndexedDB:', error);
    throw error;
  }
};
