/**
 * Type definitions for drawing functionality
 * Re-exports constants from central numerics module
 * @module drawingTypes
 */
import { openDB } from 'idb';
import type { FloorPlan, PaperSize } from '@/types/floorPlanTypes';
import { 
  GRID_SPACING,
  PIXELS_PER_METER,
  SMALL_GRID,
  LARGE_GRID
} from "@/constants/numerics";

// Re-export these types for backward compatibility
export type { FloorPlan, PaperSize };

/**
 * Represents a 2D point in the drawing
 * @typedef {Object} Point
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */
export type Point = { x: number; y: number };

/**
 * Represents a stroke (sequence of points) in the drawing
 * @typedef {Array<Point>} Stroke
 */
export type Stroke = Point[];

// Re-export constants for backward compatibility
export { GRID_SPACING, PIXELS_PER_METER, SMALL_GRID, LARGE_GRID };

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
