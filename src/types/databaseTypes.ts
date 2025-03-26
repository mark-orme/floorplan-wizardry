
/**
 * Database types and utilities
 * Defines types and constants for application's storage layer
 * @module databaseTypes
 */
import { openDB } from 'idb';
import { FloorPlan } from './floorPlanTypes';

/**
 * Name of the IndexedDB database
 * @constant {string}
 */
export const DB_NAME = 'FloorPlanDB';

/**
 * Name of the object store in the database
 * @constant {string}
 */
export const STORE_NAME = 'floorPlans';

/** 
 * Storage model for IndexedDB
 * Defines the structure of data stored in the database
 * 
 * @interface FloorPlanStorageModel
 * @property {string} id - Unique identifier for the floor plan collection
 * @property {FloorPlan[]} data - Array of floor plans belonging to a property
 */
export interface FloorPlanStorageModel {
  /** Unique identifier for the floor plan collection (typically property ID) */
  id: string;
  /** Array of floor plans belonging to a property */
  data: FloorPlan[];
}

/** 
 * Initialize IndexedDB database
 * Creates and configures the database and required object stores
 * 
 * @returns {Promise<IDBDatabase>} Initialized database instance
 * 
 * @example
 * // Get database instance
 * const db = await getDB();
 * 
 * // Use it for operations
 * const tx = db.transaction(STORE_NAME, 'readwrite');
 * const store = tx.objectStore(STORE_NAME);
 */
export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

// Export the FloorPlan type only (with proper type import)
export type { FloorPlan };
