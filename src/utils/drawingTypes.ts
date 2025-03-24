
import { openDB } from 'idb';

// Basic drawing types
export type Point = { x: number; y: number };
export type Stroke = Point[];
export type FloorPlan = { strokes: Stroke[]; label: string; paperSize?: 'A4' | 'A3' | 'infinite' };

// Scale factors
export const GRID_SIZE = 0.1; // 0.1m grid
export const PIXELS_PER_METER = 100; // 1 meter = 100 pixels
export const SMALL_GRID = GRID_SIZE * PIXELS_PER_METER; // 0.1m grid = 10px
export const LARGE_GRID = 1.0 * PIXELS_PER_METER; // 1.0m grid = 100px

// IndexedDB Constants
export const DB_NAME = 'FloorPlanDB';
export const STORE_NAME = 'floorPlans';

/** Initialize IndexedDB */
export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};
