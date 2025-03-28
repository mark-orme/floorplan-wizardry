
/**
 * Drawing-related type definitions
 * @module drawingTypes
 */
import { Path as FabricPath } from 'fabric';

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

/**
 * Point interface with x and y coordinates
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Zoom direction options
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom options configuration
 */
export interface ZoomOptions {
  /** Direction to zoom */
  direction: ZoomDirection;
  /** Zoom factor */
  factor?: number;
  /** Zoom center point */
  point?: Point;
}

/**
 * Debug info state interface
 */
export interface DebugInfoState {
  /** Frames per second */
  fps: number;
  /** Frame rendering time in ms */
  frameTime: number;
  /** Shows if debug info is visible */
  showDebugInfo: boolean;
  /** Shows if canvas is initialized */
  canvasInitialized: boolean;
  /** Shows if dimensions are set */
  dimensionsSet: boolean;
  /** Shows if grid is created */
  gridCreated: boolean;
  /** Shows if brush is initialized */
  brushInitialized: boolean;
  /** Shows if canvas is ready */
  canvasReady: boolean;
  /** Shows if canvas is created */
  canvasCreated: boolean;
  /** Shows if canvas is loaded */
  canvasLoaded: boolean;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Grid object count */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
  /** Error state */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance statistics */
  performanceStats: Record<string, number>;
  /** Optional grid initialization state */
  gridInitialized?: boolean;
  /** Optional debug messages */
  messages?: string[];
  /** Optional object count */
  objectCount?: number;
  /** Optional canvas dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Optional current tool */
  currentTool?: string;
  /** Optional initialization time */
  initTime?: number;
  /** Optional grid objects count */
  gridObjects?: number;
  /** Optional canvas objects count */
  canvasObjects?: number;
  /** Optional canvas width */
  canvasWidth?: number;
  /** Optional canvas height */
  canvasHeight?: number;
  /** Optional device pixel ratio */
  devicePixelRatio?: number;
  /** Optional last error */
  lastError?: any;
  /** Optional last error time */
  lastErrorTime?: number;
  /** Optional canvas events registered flag */
  canvasEventsRegistered?: boolean;
  /** Optional grid rendered flag */
  gridRendered?: boolean;
  /** Optional tools initialized flag */
  toolsInitialized?: boolean;
}

/**
 * State for drawing operations
 */
export interface DrawingState {
  /** Whether the user is currently drawing */
  isDrawing: boolean;
  /** Current zoom level */
  zoomLevel: number;
  /** Last X coordinate */
  lastX: number;
  /** Last Y coordinate */
  lastY: number;
  /** Start X coordinate */
  startX: number;
  /** Start Y coordinate */
  startY: number;
  /** End X coordinate */
  endX: number;
  /** End Y coordinate */
  endY: number;
  /** Current path being drawn */
  currentPath: FabricPath | null;
  /** Whether pressure sensitivity is enabled */
  usePressure?: boolean;
  /** Whether stylus is detected */
  stylusDetected?: boolean;
  /** Whether path dragging is enabled */
  pathDragging?: boolean;
  /** Whether shape creation is in progress */
  creatingShape?: boolean;
  /** Starting point of the current drawing operation */
  startPoint: Point | null;
  /** Current point of the drawing operation */
  currentPoint: Point | null;
  /** Current cursor position */
  cursorPosition: Point | null;
  /** Mid point between start and current points */
  midPoint: Point | null;
  /** Whether selection is active */
  selectionActive: boolean;
  /** Current zoom level for scaling display */
  currentZoom: number;
  /** Array of points for complex drawings */
  points: Point[];
  /** Distance between start and current points in current units */
  distance: number | null;
  /** Whether to snap to grid */
  snapToGrid?: boolean;
  /** Tool type being used */
  toolType?: string;
  /** Line width */
  width?: number;
  /** Line color */
  color?: string;
}

/**
 * Create default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  zoomLevel: 1,
  lastX: 0,
  lastY: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  currentPath: null,
  usePressure: false,
  stylusDetected: false,
  pathDragging: false,
  creatingShape: false,
  startPoint: null,
  currentPoint: null,
  cursorPosition: null,
  midPoint: null,
  selectionActive: false,
  currentZoom: 1,
  points: [],
  distance: null,
  snapToGrid: true,
  toolType: 'line',
  width: 2,
  color: '#000000'
});
