/**
 * Drawing types module
 * Defines interfaces and types for canvas drawing and floor plan management
 * @module drawingTypes
 */

import { Object as FabricObject } from 'fabric';

/**
 * Represents a point with x and y coordinates
 * @interface Point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents the dimensions of the canvas
 * @interface CanvasDimensions
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Represents a floor plan with its properties
 * @interface FloorPlan
 */
export interface FloorPlan {
  id: number;
  name: string;
  svgData: string;
  gia: number;
  objects?: FabricObject[];
}

/**
 * Represents the state of debug information
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  canvasInitialized: boolean;
  gridCreated: boolean;
  dimensionsSet: boolean;
  brushInitialized: boolean;
}

/**
 * Represents the drawing state with start and current points
 * @interface DrawingState
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  cursorPosition: Point | null;
  midPoint: Point | null;
}

/**
 * Represents the available drawing tools
 * @type DrawingTool
 */
export type DrawingTool = "straightLine" | "room" | "select";

/**
 * Represents a callback function for grid creation
 * @type GridCreationCallback
 */
export type GridCreationCallback = (canvas: fabric.Canvas) => fabric.Object[];

/**
 * Grid manager state interface
 * Tracks grid creation state and configuration
 */
export interface GridManagerState {
  // Creation time tracking
  lastCreationTime: number;
  inProgress: boolean;
  
  // Dimensions tracking
  lastDimensions: { width: number, height: number };
  
  // Initialization state
  initialized: boolean;
  totalCreations: number;
  
  // Configuration
  maxRecreations: number;
  minRecreationInterval: number;
  throttleInterval: number;
  
  // Grid state
  exists: boolean;
  
  // Batch processing state
  batchTimeoutId: number | null;
  
  // Safety timeout (ms) to reset inProgress if creation takes too long
  safetyTimeout: number;
  
  // Flags to prevent race conditions
  lastResetTime: number;
  consecutiveResets: number;
  maxConsecutiveResets: number;
  resetDelay: number; // Added missing property
  
  // Track creation locks with timestamp
  creationLock: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  };
}
