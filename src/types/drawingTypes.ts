
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
 * Debug info state for drawing components
 */
export interface DebugInfoState {
  /** Whether the canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether the canvas is ready for interaction */
  canvasReady: boolean;
  /** Whether dimensions have been set on the canvas */
  dimensionsSet: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Whether there is an error */
  hasError: boolean;
  /** Error message if hasError is true */
  errorMessage: string;
  /** Number of grid objects */
  gridObjectCount: number;
  /** Current FPS (frames per second) */
  fps: number;
  /** Number of visible objects */
  visibleObjectCount: number;
  /** Current zoom level */
  zoomLevel: number;
  /** Whether the grid is visible */
  gridVisible: boolean;
  /** Number of selected objects */
  objectsSelectedCount: number;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether grid is rendered */
  gridRendered: boolean;
  /** Whether tools are initialized */
  toolsInitialized: boolean;
}

/**
 * Canvas drawing state
 */
export interface DrawingState {
  /** Current tool */
  tool: string;
  /** Line color */
  lineColor: string;
  /** Line thickness */
  lineThickness: number;
  /** Whether grid is visible */
  showGrid: boolean;
  /** Whether snap to grid is enabled */
  snapToGrid: boolean;
  /** Whether the user is currently drawing */
  isDrawing: boolean;
  /** The starting point of the drawing */
  startPoint: Point | null;
  /** The current point of the drawing */
  currentPoint: Point | null;
  /** The current cursor position */
  cursorPosition: Point | null;
  /** The midpoint between start and current point */
  midPoint: Point | null;
  /** Current zoom level for scaling display */
  currentZoom: number;
  /** Array of all points in the current stroke */
  points: Point[];
  /** Distance between startPoint and currentPoint */
  distance: number | null;
  /** Zoom direction enum for managing canvas zoom operations */
  zoomDirection?: 'in' | 'out' | 'reset';
  /** Last X coordinate */
  lastX: number;
  /** Last Y coordinate */
  lastY: number;
  /** Start X coordinate */
  startX: number;
  /** Start Y coordinate */
  startY: number;
  /** End X coordinate */
  endX?: number;
  /** End Y coordinate */
  endY?: number;
  /** Path start point */
  pathStartPoint: Point | null;
  /** Selection active state */
  selectionActive: boolean;
  /** Tool type */
  toolType?: string;
  /** Line width */
  width?: number;
  /** Line color */
  color?: string;
}

/**
 * ZoomDirection enum for canvas zoom operations
 */
export enum ZoomDirection {
  IN = 'in',
  OUT = 'out',
  RESET = 'reset'
}

/**
 * Performance statistics object for canvas tracking
 */
export interface PerformanceStats {
  /** Frames per second */
  fps: number;
  /** Average render time in milliseconds */
  averageRenderTime: number;
  /** Number of visible objects */
  visibleObjects: number;
  /** Total number of objects */
  totalObjects: number;
  /** Memory usage in MB */
  memoryUsage: number;
  /** Number of dropped frames */
  droppedFrames: number;
}

/**
 * Distance tool state for measurement 
 */
export interface DistanceToolState {
  /** Whether the tool is active */
  active: boolean;
  /** Starting point of the measurement */
  startPoint: Point | null;
  /** Ending point of the measurement */
  endPoint: Point | null;
  /** Calculated distance in pixels */
  distance: number | null;
  /** Calculated distance in meters */
  distanceInMeters: number | null;
  /** Scale factor for conversion */
  scale: number;
}

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

/**
 * Gesture type for multi-touch interactions
 */
export enum GestureType {
  PAN = 'pan',
  PINCH = 'pinch',
  ROTATE = 'rotate',
  NONE = 'none'
}

/**
 * Gesture state for tracking multi-touch interactions
 */
export interface GestureState {
  /** Type of gesture currently detected */
  type: GestureType;
  /** Starting points of the gesture */
  startPoints: Point[];
  /** Current points of the gesture */
  currentPoints: Point[];
  /** Scale factor for pinch gestures */
  scale: number;
  /** Rotation angle for rotate gestures */
  rotation: number;
  /** Translation offset for pan gestures */
  translation: Point;
}

/**
 * Create a default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => ({
  tool: 'select',
  lineColor: '#000000',
  lineThickness: 2,
  showGrid: true,
  snapToGrid: true,
  isDrawing: false,
  startPoint: null,
  currentPoint: null,
  cursorPosition: null,
  midPoint: null,
  currentZoom: 1,
  points: [],
  distance: null,
  lastX: 0,
  lastY: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  pathStartPoint: null,
  selectionActive: false,
  zoomLevel: 1,
  toolType: 'line',
  width: 2,
  color: '#000000'
});

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
