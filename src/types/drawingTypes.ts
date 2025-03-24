
/**
 * Shared type definitions for drawing functionality
 * @module drawingTypes
 */
import { Object as FabricObject } from "fabric";

/**
 * Point coordinates in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Drawing state during interactions
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint?: Point;
  currentPoint?: Point;
  midPoint?: Point;
  cursorPosition?: Point;
  lineLength?: number;
}

/**
 * Grid creation results
 */
export interface GridCreationResult {
  success: boolean;
  gridObjects: Array<FabricObject>;
  smallGridLines: Array<FabricObject>;
  largeGridLines: Array<FabricObject>;
  markers: Array<FabricObject>;
}

/**
 * Canvas performance metrics
 */
export interface CanvasLoadTimes {
  startTime: number;
  canvasReady: number;
  gridCreated: number;
}

/**
 * Grid cell structure
 */
export interface GridCell {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Canvas dimensions
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Debug information structure
 */
export interface DebugInfoState {
  canvasInitialized: boolean;
  gridCreated: boolean;
  dimensionsSet: boolean;
  brushInitialized: boolean;
}

/**
 * Grid manager configuration and state
 */
export interface GridManagerState {
  lastCreationTime: number;
  inProgress: boolean;
  lastDimensions: CanvasDimensions;
  initialized: boolean;
  totalCreations: number;
  maxRecreations: number;
  minRecreationInterval: number;
  throttleInterval: number;
  exists: boolean;
  batchTimeoutId: number | null;
  safetyTimeout: number;
  lastResetTime: number;
  consecutiveResets: number;
  maxConsecutiveResets: number;
  creationLock: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  }
}
