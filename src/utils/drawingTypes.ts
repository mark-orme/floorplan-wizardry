
/**
 * Type definitions for drawing functionality
 * @module drawingTypes
 */
import { openDB } from 'idb';

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

/**
 * Represents a floor plan with multiple strokes
 * @typedef {Object} FloorPlan
 * @property {Array<Stroke>} strokes - Collection of strokes that make up the floor plan
 * @property {string} label - Label for the floor plan
 * @property {'A4' | 'A3' | 'infinite'} [paperSize] - Paper size for the floor plan
 */
export type FloorPlan = { strokes: Stroke[]; label: string; paperSize?: 'A4' | 'A3' | 'infinite' };

// Scale factors
/**
 * Size of the small grid in meters
 * @constant {number}
 */
export const GRID_SIZE = 0.1; // 0.1m grid

/**
 * Number of pixels per meter (scale factor)
 * @constant {number}
 */
export const PIXELS_PER_METER = 100; // 1 meter = 100 pixels

/**
 * Size of the small grid in pixels
 * @constant {number}
 */
export const SMALL_GRID = GRID_SIZE * PIXELS_PER_METER; // 0.1m grid = 10px

/**
 * Size of the large grid in pixels
 * @constant {number}
 */
export const LARGE_GRID = 1.0 * PIXELS_PER_METER; // 1.0m grid = 100px

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
