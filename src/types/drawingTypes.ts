
/**
 * Canvas dimensions type
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Drawing mode type
 */
export type DrawingMode = 'select' | 'draw' | 'line' | 'rectangle' | 'circle' | 'text' | 'eraser';

/**
 * Zoom direction enum
 */
export enum ZoomDirection {
  IN = 'in',
  OUT = 'out'
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
  canvasInitialized?: boolean;
  errorMessage?: string;
}

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: { x: number; y: number } | null;
  currentPoint: { x: number; y: number } | null;
  points: Array<{ x: number; y: number }>;
  distance: number;
  cursorPosition: { x: number; y: number };
  currentZoom?: number;
}

/**
 * Create default drawing state function
 */
export function createDefaultDrawingState(): DrawingState {
  return { 
    isDrawing: false, 
    startPoint: null, 
    currentPoint: null, 
    points: [], 
    distance: 0, 
    cursorPosition: { x: 0, y: 0 }
  };
}

/**
 * Canvas state result type
 */
export interface UseCanvasStateResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<any>;
  initializeCanvas: () => void;
  disposeCanvas: () => void;
  isInitialized: boolean;
}

/**
 * Gesture types for touch interactions
 */
export type GestureType = 'pinch' | 'rotate' | 'pan';
export type GestureState = 'start' | 'move' | 'end';
export interface GestureStateObject {
  type: GestureType;
  state: GestureState;
  scale?: number;
  rotation?: number;
  translation?: { x: number; y: number };
}
