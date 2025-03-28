
/**
 * Types related to drawing operations
 * @module types/drawingTypes
 */
import { DrawingMode } from '@/constants/drawingModes';
import { createDefaultDrawingState as originalCreateDefaultDrawingState } from '@/types/core/DrawingState';

/**
 * Point representation
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Canvas dimensions
 * @interface CanvasDimensions
 */
export interface CanvasDimensions {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
}

/**
 * Debug information state for canvas
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether to display debug information */
  showDebugInfo: boolean;
  /** Whether canvas was initialized */
  canvasInitialized: boolean;
  /** Whether dimensions were set */
  dimensionsSet: boolean;
  /** Whether grid was created */
  gridCreated: boolean;
  /** Whether event handlers were set */
  eventHandlersSet: boolean;
  /** Whether brush was initialized */
  brushInitialized: boolean;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Whether canvas was created */
  canvasCreated: boolean;
  /** Whether canvas was loaded */
  canvasLoaded: boolean;
  /** Whether canvas events were registered */
  canvasEventsRegistered: boolean;
  /** Whether grid was rendered */
  gridRendered: boolean;
  /** Whether tools were initialized */
  toolsInitialized: boolean;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Grid object count */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
  /** Whether an error occurred */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance statistics */
  performanceStats: Record<string, unknown>;
}

/**
 * Drawing state
 * @interface DrawingState
 */
export interface DrawingState {
  /** Current drawing tool */
  tool: DrawingMode;
  /** Line thickness */
  lineThickness: number;
  /** Line color */
  lineColor: string;
  /** Current floor */
  currentFloor: number;
  /** Whether drawing is in progress */
  isDrawing: boolean;
  /** Whether the drawing has been modified */
  isDirty: boolean;
  /** Zoom level */
  zoomLevel: number;
  /** Last saved timestamp */
  lastSaved: number;
}

/**
 * Zoom direction enum
 * @type {string}
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom options
 * @interface ZoomOptions
 */
export interface ZoomOptions {
  /** Zoom level */
  level: number;
  /** Zoom center x coordinate */
  centerX?: number;
  /** Zoom center y coordinate */
  centerY?: number;
  /** Whether to skip rendering */
  skipRender?: boolean;
}

/**
 * Create a default drawing state
 * Re-exports the function from core/DrawingState.ts for backward compatibility
 * @returns {DrawingState} A default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => {
  // Start with the core drawing state
  const coreState = originalCreateDefaultDrawingState();
  
  // Convert to the simpler DrawingState interface used in this file
  return {
    tool: DrawingMode.SELECT,
    lineThickness: 2,
    lineColor: '#000000',
    currentFloor: 0,
    isDrawing: false,
    isDirty: false,
    zoomLevel: 1,
    lastSaved: Date.now()
  };
};
