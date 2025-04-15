
import { openDB } from 'idb';

const DB_NAME = 'floorplan-db';
const STORE_NAME = 'canvas-snapshots';

/**
 * Get or create IndexedDB database instance
 * @returns Promise resolving to database instance
 */
export const getDB = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

/**
 * Save canvas state to IndexedDB
 * @param key Unique identifier for the canvas state
 * @param json Canvas JSON representation
 */
export async function saveCanvasToIDB(key: string, json: object) {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, json, key);
    console.log(`Canvas state saved to IndexedDB with key: ${key}`);
  } catch (error) {
    console.error('Error saving canvas to IndexedDB:', error);
  }
}

/**
 * Load canvas state from IndexedDB
 * @param key Unique identifier for the canvas state
 * @returns Promise resolving to the saved canvas state or undefined if not found
 */
export async function loadCanvasFromIDB(key: string) {
  try {
    const db = await getDB();
    return db.get(STORE_NAME, key);
  } catch (error) {
    console.error('Error loading canvas from IndexedDB:', error);
    return undefined;
  }
}

/**
 * Delete a saved canvas state from IndexedDB
 * @param key Unique identifier for the canvas state to delete
 */
export async function clearSavedCanvas(key: string) {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, key);
    console.log(`Canvas state with key ${key} cleared from IndexedDB`);
  } catch (error) {
    console.error('Error clearing canvas from IndexedDB:', error);
  }
}

/**
 * List all saved canvas keys
 * @returns Promise resolving to array of canvas keys
 */
export async function listSavedCanvasKeys() {
  try {
    const db = await getDB();
    return db.getAllKeys(STORE_NAME);
  } catch (error) {
    console.error('Error listing canvas keys from IndexedDB:', error);
    return [];
  }
}
