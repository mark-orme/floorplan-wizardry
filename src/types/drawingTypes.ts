
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
