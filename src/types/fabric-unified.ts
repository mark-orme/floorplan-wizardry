
/**
 * Unified Fabric.js type definitions
 * This file serves as the single source of truth for Fabric.js related types
 */
import { Canvas, Object as FabricObject, ILineOptions, Group, Path } from 'fabric';

/**
 * Extended Fabric Canvas with additional properties
 */
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLElement;
  renderOnAddRemove: boolean;
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  viewportTransform?: number[];
  getActiveObject?: () => any;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  zoomToPoint?: (point: { x: number, y: number }, value: number) => void;
  initialize: (element: string | HTMLCanvasElement, options?: any) => Canvas;
  _activeObject?: any;
  _objects?: any[];
  targets?: any[];
}

/**
 * Extended Fabric Object with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  evented?: boolean;
  set(options: Record<string, any>): FabricObject;
}

/**
 * Basic point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a new point
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate distance between two points
 */
export function distance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Measurement data interface for line tools
 */
export interface MeasurementData {
  distance: number | null;
  angle: number | null;
  snapped: boolean;
  unit: string;
  snapType?: 'grid' | 'angle' | 'both';
  startPoint?: Point; // Add this missing property
  endPoint?: Point; // Add this missing property
}

/**
 * Grid constants for consistent usage
 */
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE: 20,
  LARGE_GRID_SIZE: 100,
  SMALL_GRID_COLOR: '#e5e5e5',
  LARGE_GRID_COLOR: '#cccccc',
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  PIXELS_PER_METER: 100  // Add this constant
};

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  id?: string;
  name?: string;
  description?: string;
  updated?: string;
  modified?: string;
  paperSize?: string;
  level?: number;
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
  label?: string; // Add missing property
}

/**
 * Canvas state interface
 */
export interface CanvasState {
  objects: FabricObject[];
  background: string;
  width: number;
  height: number;
  zoom: number;
  zoomLevel: number;
  viewportTransform: number[];
  tool: string;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

/**
 * Debug info state interface
 */
export interface DebugInfoState {
  fps?: number;
  objectCount?: number;
  visibleObjectCount?: number;
  mousePosition?: { x: number; y: number };
  zoomLevel?: number;
  gridSize?: number;
  canvasDimensions?: { width: number; height: number };
  canvasInitialized?: boolean;
  errorMessage?: string;
  hasError?: boolean; // Add missing property
  lastInitTime?: number; // Add missing property
  lastGridCreationTime?: number; // Add missing property
}

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  tool?: string;
  pathStartPoint?: Point | null;
  lineColor?: string;
  lineThickness?: number;
  currentPath?: any | null;
  startPoint?: Point | null;
  currentPoint?: Point | null;
  points?: Point[];
  distance?: number;
  cursorPosition?: Point | null;
  zoomLevel?: number;
}

/**
 * Create default drawing state
 */
export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    pathStartPoint: null,
    lineColor: '#000000',
    lineThickness: 2,
    currentPath: null,
    startPoint: null,
    currentPoint: null,
    points: [],
    distance: 0,
    cursorPosition: null,
    zoomLevel: 1
  };
}

/**
 * Gesture state object interface
 */
export interface GestureStateObject {
  type: 'pinch' | 'rotate' | 'pan';
  state: 'start' | 'move' | 'end';
  scale?: number;
  rotation?: number;
  translation?: { x: number; y: number };
  startPoints?: Point[]; // Add missing property
}

/**
 * Canvas state result interface
 */
export interface UseCanvasStateResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  initializeCanvas: () => void;
  disposeCanvas: () => void;
  isInitialized: boolean;
}

/**
 * Helper function to cast a normal canvas to extended canvas
 */
export function asExtendedCanvas(canvas: Canvas): ExtendedFabricCanvas {
  return canvas as unknown as ExtendedFabricCanvas;
}

/**
 * Helper function to cast a normal object to extended object
 */
export function asExtendedObject(obj: FabricObject): ExtendedFabricObject {
  return obj as unknown as ExtendedFabricObject;
}
