
/**
 * Export common types
 */
export * from './core/Point';
export * from './core/Geometry';
export * from './core/DrawingTool';
export * from './core/DebugInfo';

/**
 * Type definitions for drawing functionality
 * Re-exports constants from central numerics module
 * @module drawingTypes
 */
import { openDB } from 'idb';
import type { FloorPlan, Stroke, PaperSize } from '@/types/floorPlanTypes';
import type { Point } from '@/types/core/Point';
import { 
  GRID_SPACING,
  PIXELS_PER_METER,
  SMALL_GRID,
  LARGE_GRID
} from "@/constants/numerics";

// Re-export these types for backward compatibility
export type { FloorPlan, Point, Stroke, PaperSize };

// Re-export constants for backward compatibility
export { GRID_SPACING, PIXELS_PER_METER, SMALL_GRID, LARGE_GRID };

/**
 * Zoom direction type
 */
export enum ZoomDirection {
  IN = 'in',
  OUT = 'out'
}

/**
 * Drawing state for canvas
 */
export type DrawingState = 'idle' | 'drawing' | 'editing' | 'selecting';

/**
 * Database constants for IndexedDB operations
 * @constant {Object}
 */
export const DB_CONSTANTS = {
  /** Name of the IndexedDB database */
  DB_NAME: 'FloorPlanDB',
  
  /** Name of the object store in the database */
  STORE_NAME: 'floorPlans',
  
  /** Version of the IndexedDB database */
  DB_VERSION: 1
};

/** 
 * Initialize IndexedDB 
 * @returns {Promise<IDBDatabase>} Initialized database
 */
export const getDB = async () => {
  return openDB(DB_CONSTANTS.DB_NAME, DB_CONSTANTS.DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DB_CONSTANTS.STORE_NAME)) {
        db.createObjectStore(DB_CONSTANTS.STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};
