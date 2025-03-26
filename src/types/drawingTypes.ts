
/**
 * Type definitions for drawing functionality
 * @module drawingTypes
 */
import { openDB } from 'idb';
import { DB_NAME, STORE_NAME } from './databaseTypes';
import type { FloorPlanDBSchema } from './databaseTypes';

// Re-export all types from focused type modules
export * from './geometryTypes';
export * from './drawingStateTypes';
export * from './gridTypes';
export * from './debugTypes';
export * from './floorPlanTypes';
export * from './performanceTypes';
export * from './databaseTypes';

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
