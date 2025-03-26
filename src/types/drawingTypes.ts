/**
 * Type definitions for drawing functionality
 * @module drawingTypes
 */
import { openDB, DBSchema } from 'idb';
import type { FloorPlan, PaperSize } from '@/types/floorPlanTypes';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

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
 * Debug information state interface
 */
export interface DebugInfoState {
  /** Whether the canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Whether canvas dimensions have been properly set */
  dimensionsSet: boolean;
  /** Whether the drawing brush has been initialized */
  brushInitialized: boolean;
  /** Number of grid creation attempts */
  gridCreationAttempts: number;
  /** Number of grid creation failures */
  gridCreationFailures: number;
  /** Time taken for the last grid creation (ms) */
  lastGridCreationTime: number;
  /** Last error message */
  lastError: string | null;
  /** Timestamp of the last error */
  lastErrorTime: number;
  /** Number of objects on the canvas */
  canvasObjects: number;
  /** Number of grid objects on the canvas */
  gridObjects: number;
  /** Current canvas width */
  canvasWidth: number;
  /** Current canvas height */
  canvasHeight: number;
  /** Device pixel ratio */
  devicePixelRatio: number;
  /** Whether the grid is visible */
  gridVisible: boolean;
  /** Performance statistics */
  performanceStats: {
    /** Average frames per second */
    fps?: number;
    /** Number of dropped frames */
    droppedFrames?: number;
    /** Average frame time in milliseconds */
    frameTime?: number;
    /** Maximum frame time recorded */
    maxFrameTime?: number;
    /** Number of frames exceeding budget */
    longFrames?: number;
  };
}

/**
 * Grid creation callback type
 * @typedef {Function} GridCreationCallback
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {FabricObject[]} - Array of created grid objects
 */
export type GridCreationCallback = (canvas: FabricCanvas) => FabricObject[];

/**
 * Grid creation state type
 * @typedef {Object} GridCreationState
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

/**
 * Database schema for IndexedDB
 */
export interface FloorPlanDBSchema extends DBSchema {
  floorPlans: {
    key: string;
    value: FloorPlan;
  };
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
  return openDB<FloorPlanDBSchema>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};
