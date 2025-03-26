
/**
 * Database types and utilities
 * @module databaseTypes
 */
import { openDB } from 'idb';
import { FloorPlan } from './floorPlanTypes';

// IndexedDB Constants
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
 */
export interface FloorPlanStorageModel {
  id: string;
  data: FloorPlan[];
}

/** 
 * Initialize IndexedDB 
 * @returns {Promise<IDBDatabase>} Initialized database
 */
export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

// Export the FloorPlan type only (with proper type import)
export type { FloorPlan };
