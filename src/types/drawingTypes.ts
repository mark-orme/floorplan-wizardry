
/**
 * Type definitions for drawing functionality
 * @module drawingTypes
 */
import { openDB } from 'idb';
import type { FloorPlan, PaperSize } from '@/types/floorPlanTypes';

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
 * Represents the current state of drawing
 * @typedef {Object} DrawingState
 * @property {boolean} isDrawing - Whether the user is currently drawing
 * @property {Point | null} startPoint - The starting point of the drawing
 * @property {Point | null} currentPoint - The current point of the drawing
 * @property {Point | null} cursorPosition - The current cursor position
 * @property {Point | null} midPoint - The midpoint between start and current point
 * @property {boolean} selectionActive - Whether a selection is active
 * @property {number} [currentZoom] - Current zoom level for scaling display
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  cursorPosition: Point | null;
  midPoint: Point | null;
  selectionActive: boolean;
  currentZoom?: number;
}

/**
 * Represents a stroke (sequence of points) in the drawing
 * @typedef {Array<Point>} Stroke
 */
export type Stroke = Point[];

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
