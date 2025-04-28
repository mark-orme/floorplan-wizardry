
/**
 * Drawing state module
 * @module types/core/DrawingState
 */
import { Point } from "@/types/core/Geometry";
import { DrawingMode } from "@/constants/drawingModes";

/**
 * Drawing state interface
 */
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
  snapPoint?: Point | null;
  
  // Additional properties
  mode?: DrawingMode;
  strokeStyle?: string;
  snapToGrid?: boolean;
  currentLayerId?: string;
  selectedObjects?: any[];
  
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
  midPoint?: Point | null;
  selectionActive?: boolean;
  fillColor?: string;
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
  mode: DrawingMode.SELECT,
  strokeStyle: '#000000',
  snapToGrid: false,
  currentLayerId: '',
  selectedObjects: []
});

/**
 * Export compatible types for backward compatibility
 */
export type { DrawingState as IDrawingState };
export type { DrawingState as DrawingStateType };
