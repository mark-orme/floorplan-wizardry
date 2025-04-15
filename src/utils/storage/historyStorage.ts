
import { openDB } from 'idb';

// Constants
const DB_NAME = 'floorplan-history';
const STORE_NAME = 'history';
const SCHEMA_VERSION = 2; // Increment when schema changes
const MAX_HISTORY_STATES = 50; // Maximum number of history states to keep

/**
 * Get or create the IndexedDB database for history storage
 */
const getHistoryDB = async () => {
  return openDB(DB_NAME, SCHEMA_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      // Handle schema upgrades
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      
      // If we're upgrading from version 1 to 2, we could perform data migrations
      if (oldVersion === 1 && newVersion === 2) {
        console.log('Upgrading history database from version 1 to 2');
        // Migration logic would go here if needed
      }
    },
  });
};

/**
 * Save canvas history to IndexedDB
 * @param key Unique identifier for the history entry
 * @param data Array of history snapshots
 * @param maxStates Maximum number of states to keep (defaults to MAX_HISTORY_STATES)
 * @returns Promise that resolves when save is complete
 */
export const saveCanvasHistory = async (
  key: string, 
  data: string[], 
  maxStates: number = MAX_HISTORY_STATES
): Promise<void> => {
  try {
    // Trim the history if it exceeds the maximum size
    const trimmedData = data.length > maxStates 
      ? data.slice(data.length - maxStates) 
      : data;
    
    const db = await getHistoryDB();
    await db.put(STORE_NAME, trimmedData, key);
    console.log(`History saved with key: ${key}, states: ${trimmedData.length}`);
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

/**
 * Get all history keys in the database
 * @returns Promise that resolves with an array of keys
 */
export const getHistoryKeys = async (): Promise<string[]> => {
  try {
    const db = await getHistoryDB();
    return await db.getAllKeys(STORE_NAME) as string[];
  } catch (error) {
    console.error('Error getting history keys from IndexedDB:', error);
    throw error;
  }
};

/**
 * Migrate history data to a new version
 * @param migrationFunction Function to transform old data to new format
 * @returns Promise that resolves when migration is complete
 */
export const migrateHistoryData = async (
  migrationFunction: (oldData: string[]) => string[]
): Promise<void> => {
  try {
    const db = await getHistoryDB();
    const keys = await db.getAllKeys(STORE_NAME);
    
    for (const key of keys) {
      const oldData = await db.get(STORE_NAME, key);
      if (oldData) {
        const newData = migrationFunction(oldData);
        await db.put(STORE_NAME, newData, key);
      }
    }
    
    console.log('History data migration completed');
  } catch (error) {
    console.error('Error migrating history data:', error);
    throw error;
  }
};
