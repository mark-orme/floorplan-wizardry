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

/**
 * Canvas dimensions type
 * @typedef {Object} CanvasDimensions
 * @property {number} width - Canvas width
 * @property {number} height - Canvas height
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Debug info state type
 * @typedef {Object} DebugInfoState
 * @property {boolean} canvasInitialized - Whether the canvas is initialized
 * @property {boolean} gridCreated - Whether the grid is created
 * @property {boolean} dimensionsSet - Whether dimensions are set
 * @property {boolean} brushInitialized - Whether the brush is initialized
 * @property {number} gridCreationAttempts - Number of grid creation attempts
 * @property {number} gridCreationFailures - Number of grid creation failures
 * @property {number} lastGridCreationTime - Timestamp of last grid creation
 * @property {Error | null} lastError - Last error encountered
 * @property {number} lastErrorTime - Timestamp of last error
 * @property {number} canvasObjects - Number of objects on canvas
 * @property {number} gridObjects - Number of grid objects
 * @property {number} canvasWidth - Current canvas width
 * @property {number} canvasHeight - Current canvas height
 * @property {number} devicePixelRatio - Device pixel ratio
 * @property {boolean} gridVisible - Whether grid is visible
 * @property {Record<string, any>} performanceStats - Performance statistics
 */
export interface DebugInfoState {
  canvasInitialized: boolean;
  gridCreated: boolean;
  dimensionsSet: boolean;
  brushInitialized: boolean;
  gridCreationAttempts: number;
  gridCreationFailures: number;
  lastGridCreationTime: number;
  lastError: Error | null;
  lastErrorTime: number;
  canvasObjects: number;
  gridObjects: number;
  canvasWidth: number;
  canvasHeight: number;
  devicePixelRatio: number;
  gridVisible: boolean;
  performanceStats: Record<string, any>;
}

/**
 * Grid creation callback type
 * @typedef {Function} GridCreationCallback
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {any[]} - Array of created grid objects
 */
export type GridCreationCallback = (canvas: any) => any[];

/**
 * Grid creation state type
 * @typedef {Object} GridCreationState
 * @property {boolean} creationInProgress - Whether grid creation is in progress
 * @property {number} consecutiveResets - Number of consecutive reset attempts
 * @property {number} maxConsecutiveResets - Maximum allowed consecutive resets before throttling
 * @property {number} lastAttemptTime - Last timestamp of grid creation attempt
 * @property {number} lastCreationTime - Last timestamp of grid creation completion
 * @property {boolean} exists - Whether the grid currently exists
 * @property {number} safetyTimeout - Safety timeout period in milliseconds
 * @property {number} throttleInterval - Throttle interval in milliseconds
 * @property {number} minRecreationInterval - Minimum recreation interval in milliseconds
 * @property {number} maxRecreations - Maximum number of allowed recreations
 * @property {number} totalCreations - Total number of creation attempts
 * @property {CanvasDimensions} lastDimensions - Last dimensions used for grid creation
 * @property {Object} creationLock - Creation lock information
 * @property {number} creationLock.id - Lock ID
 * @property {number} creationLock.timestamp - Lock timestamp
 * @property {boolean} creationLock.isLocked - Whether the lock is active
 */
export interface GridCreationState {
  creationInProgress: boolean;
  consecutiveResets: number;
  maxConsecutiveResets: number;
  lastAttemptTime: number;
  lastCreationTime: number;
  exists: boolean;
  safetyTimeout: number | null;
  throttleInterval: number;
  minRecreationInterval: number;
  maxRecreations: number;
  totalCreations: number;
  lastDimensions: CanvasDimensions | null;
  creationLock: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  };
  // Keep the properties from the previous definition for backward compatibility
  inProgress?: boolean;
  startTime?: number;
  attempts?: number;
  complete?: boolean;
}

/**
 * Canvas load times type
 * @typedef {Object} CanvasLoadTimes
 * @property {number} startTime - Start time of canvas loading
 * @property {number} canvasInitStart - Start time of canvas initialization
 * @property {number} canvasInitEnd - End time of canvas initialization
 * @property {number} gridCreationStart - Start time of grid creation
 * @property {number} gridCreationEnd - End time of grid creation
 * @property {number} totalLoadTime - Total load time
 * @property {boolean} canvasReady - Whether canvas is ready
 * @property {boolean} gridCreated - Whether grid is created
 */
export interface CanvasLoadTimes {
  startTime: number;
  canvasInitStart: number;
  canvasInitEnd: number;
  gridCreationStart: number;
  gridCreationEnd: number;
  totalLoadTime: number;
  canvasReady: boolean;
  gridCreated: boolean;
}

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
