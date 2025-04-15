
/**
 * Drawing state module
 * @module types/core/DrawingState
 */
import { Point } from "@/types/core/Geometry";

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  pathStartPoint: Point | null;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  isEnabled: boolean;
  
  // Added missing properties
  distance: number | null;
  cursorPosition: Point | null;
  currentZoom: number;
}

/**
 * Create a default drawing state
 */
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  pathStartPoint: null,
  startPoint: null,
  currentPoint: null,
  points: [],
  isEnabled: true,
  distance: null,
  cursorPosition: null,
  currentZoom: 1
});
