
/**
 * Type definitions for database schema
 * @module databaseTypes
 */
import { DBSchema } from 'idb';
import { FloorPlanStorageModel } from './floorPlanTypes';
import { openDB } from 'idb';

/**
 * IndexedDB Schema definition
 * @interface FloorPlanDBSchema
 */
export interface FloorPlanDBSchema extends DBSchema {
  floorPlans: {
    key: string;
    value: {
      id: string;
      data: FloorPlanStorageModel[];
    };
  };
}

/**
 * IndexedDB Constants
 */
export const DB_NAME = 'FloorPlanDB';
export const STORE_NAME = 'floorPlans';

/** 
 * Initialize IndexedDB 
 * @returns {Promise<IDBDatabase>} Initialized database
 */
export const getDB = async () => {
  return openDB<FloorPlanDBSchema>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};
