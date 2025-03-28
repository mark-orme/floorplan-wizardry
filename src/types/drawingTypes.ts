
import { Point } from './core/Point';

/**
 * State for drawing operations
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  cursorPosition: Point | null;
  midPoint: Point | null;
  selectionActive: boolean;
  currentZoom: number;
  points: Point[];
  distance: number | null;
  
  // Additional properties needed for compatibility
  zoomLevel?: number;
  lastX?: number;
  lastY?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  snapToGrid?: boolean;
  toolType?: string;
  width?: number;
  color?: string;
}

/**
 * Create default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  startPoint: null,
  currentPoint: null,
  cursorPosition: null,
  midPoint: null,
  selectionActive: false,
  currentZoom: 1,
  points: [],
  distance: null,
  zoomLevel: 1,
  lastX: 0,
  lastY: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  snapToGrid: true,
  toolType: 'line',
  width: 2,
  color: '#000000'
});
