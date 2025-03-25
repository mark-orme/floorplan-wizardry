
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Basic 2D point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Grid size constant
 */
export const GRID_SIZE = 20;

/**
 * Floor plan interface compatible with both utils/drawingTypes.ts and types/drawingTypes.ts
 */
export interface FloorPlan {
  id: string;
  name: string;
  svgData?: string;
  gia: number;
  canvas?: string;
  timestamp?: number;
  dimensions?: CanvasDimensions;
  objects?: any[];
  strokes?: Point[][];
  // Add any other properties that might be needed
}

/**
 * Grid creation state interface
 */
export interface GridCreationState {
  creationInProgress: boolean;
  consecutiveResets: number;
  maxConsecutiveResets: number;
  lastAttemptTime: number;
  creationLock: boolean;
  safetyTimeout: number | null;
  lastCreationTime: number;
  lastDimensions: CanvasDimensions | null;
  exists: boolean;
  throttleInterval: number;
  totalCreations: number;
  maxRecreations: number;
  minRecreationInterval: number;
}

/**
 * Drawing state interface for tracking current drawing operations
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  cursorPosition: Point | null;
  midPoint: Point | null;
  currentZoom?: number;
}

/**
 * Debug info state interface
 */
export interface DebugInfoState {
  gridCreationAttempts: number;
  gridCreationFailures: number;
  lastGridCreationTime: number;
  lastError: string | null;
  lastErrorTime: number;
  canvasObjects: number;
  gridObjects: number;
  canvasWidth: number;
  canvasHeight: number;
  devicePixelRatio: number;
  gridVisible: boolean;
  performanceStats: Record<string, number>;
  // Add the missing properties
  canvasInitialized: boolean;
  gridCreated: boolean;
  dimensionsSet: boolean;
  brushInitialized: boolean;
}

/**
 * Canvas load times interface
 */
export interface CanvasLoadTimes {
  canvasInitStart: number;
  canvasInitEnd: number;
  gridCreationStart: number;
  gridCreationEnd: number;
  totalLoadTime: number;
  // Add missing properties
  startTime: number;
  canvasReady: boolean;
  gridCreated: boolean;
}

/**
 * Grid creation callback type
 * Updated to match actual usage pattern in the codebase
 */
export type GridCreationCallback = (canvas: Canvas) => any[];

/**
 * Type definition for FabricCanvas to match Canvas from fabric
 */
export type FabricCanvas = Canvas;

// Re-export the GRID_SIZE to ensure it's available
export { GRID_SIZE as GRID_CELL_SIZE };
