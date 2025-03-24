/**
 * Shared type definitions for drawing functionality
 * @module drawingTypes
 */
import { Object as FabricObject, Canvas as FabricCanvas } from "fabric";

/**
 * Point coordinates in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Drawing state for tracking the current drawing operation
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint?: Point | null;
  currentPoint?: Point | null;
  cursorPosition?: Point | null;
  midPoint?: Point | null;
  currentZoom?: number; // Add currentZoom property for tooltip
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

/**
 * Handlers for canvas drawing interactions
 */
export interface DrawingHandlers {
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
  cleanupTimeouts: () => void;
}

/**
 * Grid creation callback type
 */
export type GridCreationCallback = (canvas: FabricCanvas) => FabricObject[];

/**
 * Path processing callbacks
 */
export interface PathProcessingCallbacks {
  processPoints: (points: Point[]) => Point[];
  convertToPixelPoints: (meterPoints: Point[], zoom?: number) => Point[];
  convertToMeterPoints: (pixelPoints: Point[], zoom?: number) => Point[];
  isShapeClosed: (points: Point[]) => boolean;
}

/**
 * Path processing result
 */
export interface ProcessedPath {
  points: Point[];
  length?: number;
  area?: number;
  isClosed?: boolean;
}
