
/**
 * Drawing types definition file
 * Contains types specific to drawing functionality
 */

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
}
