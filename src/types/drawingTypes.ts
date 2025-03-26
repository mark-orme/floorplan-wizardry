
/**
 * Drawing state type definitions
 * @module drawingTypes
 */
import type { FloorPlan, PaperSize, Point } from './floorPlanTypes';

export type { FloorPlan, PaperSize, Point };

export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Drawing state interface - represents the current state of drawing
 * @interface DrawingState
 */
export interface DrawingState {
  /** Whether drawing is currently active */
  isDrawing: boolean;
  /** Starting point of current drawing */
  startPoint: Point | null;
  /** Current point during drawing */
  currentPoint: Point | null;
  /** Current cursor position for tooltips */
  cursorPosition: Point | null;
  /** Middle point of the line for tooltip placement */
  midPoint: Point | null;
  /** Whether selection is currently active */
  selectionActive: boolean;
  /** Current zoom level of the canvas */
  currentZoom?: number;
}

/**
 * Grid creation callback type
 */
export type GridCreationCallback = (canvas: any) => any[];

/**
 * Grid creation state type
 */
export interface GridCreationState {
  /** Whether grid creation is in progress */
  isCreating: boolean;
  /** Number of creation attempts */
  attempts: number; 
  /** Whether creation was successful */
  success: boolean;
  /** Error message if creation failed */
  error?: string;
  /** Whether creation is currently in progress */
  creationInProgress?: boolean;
  /** Number of consecutive reset attempts */
  consecutiveResets?: number;
  /** Maximum allowed consecutive resets */
  maxConsecutiveResets?: number;
  /** Timestamp of last attempt */
  lastAttemptTime?: number;
  /** Timestamp of last successful creation */
  lastCreationTime?: number;
  /** Minimum interval between creation attempts */
  throttleInterval?: number;
  /** Whether grid already exists */
  exists?: boolean;
  /** Timeout ID for safety mechanism */
  safetyTimeout?: number | null;
  /** Total number of grid creations */
  totalCreations?: number;
  /** Maximum allowed recreations */
  maxRecreations?: number;
  /** Minimum interval between recreations */
  minRecreationInterval?: number;
  /** Last known canvas dimensions */
  lastDimensions?: { width: number; height: number };
  /** Creation lock mechanism */
  creationLock?: {
    id: number;
    timestamp: number;
    isLocked: boolean;
  };
}

// Re-export DebugInfoState from debugTypes
export type { DebugInfoState } from './debugTypes';
