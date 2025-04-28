
/**
 * Unified DrawingState interface that merges all previous definitions
 */
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';

export interface DrawingState {
  // Core drawing state
  isDrawing: boolean;
  tool: DrawingMode;
  
  // Position tracking
  startPoint: Point | null;
  currentPoint: Point | null;
  pathStartPoint: Point | null;
  cursorPosition: Point | null;
  points: Point[];
  
  // Drawing properties
  lineColor: string;
  lineThickness: number;
  distance: number | null;
  currentZoom: number;
  
  // UI state
  isEnabled: boolean;
  isSnapping?: boolean;
  snapPoint?: Point;
  
  // Additional properties from other implementations
  midPoint?: Point | null;
  selectionActive?: boolean;
  
  // Optional properties for backwards compatibility
  zoomLevel?: number;
  lastX?: number;
  lastY?: number;
  startX?: number;
  startY?: number;
  currentPath?: any;
  usePressure?: boolean;
  stylusDetected?: boolean;
  pathDragging?: boolean;
  creatingShape?: boolean;
  
  // Properties for compatibility with useCanvasControllerDrawingState
  currentLayerId?: string;
  selectedObjects?: string[];
  fillColor?: string;
  snapToGrid?: boolean;
}

/**
 * Create a default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  tool: DrawingMode.SELECT,
  pathStartPoint: null,
  startPoint: null,
  currentPoint: null,
  points: [],
  isEnabled: true,
  distance: null,
  cursorPosition: null,
  currentZoom: 1,
  lineColor: '#000000',
  lineThickness: 2,
  isSnapping: false,
  currentLayerId: 'default',
  selectedObjects: [],
  fillColor: 'transparent',
  snapToGrid: false
});
