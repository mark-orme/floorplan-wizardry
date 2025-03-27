
/**
 * Canvas drawing state hook
 * Manages drawing-specific state for canvas operations
 * @module hooks/canvas/drawing/useCanvasDrawingState
 */
import { useState, useCallback } from 'react';
import { DrawingState } from '@/types/drawingTypes';
import { ZOOM_CONSTANTS } from '@/constants/zoomConstants';

/**
 * Initial drawing state
 */
const INITIAL_DRAWING_STATE: DrawingState = {
  isDrawing: false,
  zoomLevel: ZOOM_CONSTANTS.DEFAULT_ZOOM,
  lastX: 0,
  lastY: 0,
  startX: 0,
  startY: 0,
  currentPath: null,
  usePressure: false,
  stylusDetected: false,
  pathDragging: false,
  creatingShape: false
};

/**
 * Return type for the drawing state hook
 */
export interface UseCanvasDrawingStateReturn {
  /** Current drawing state */
  drawingState: DrawingState;
  /** Function to update drawing state */
  setDrawingState: (state: React.SetStateAction<DrawingState>) => void;
  /** Reset drawing state to initial values */
  resetDrawingState: () => void;
}

/**
 * Hook for managing canvas drawing state
 * @returns Drawing state management functions
 */
export const useCanvasDrawingState = (): UseCanvasDrawingStateReturn => {
  const [drawingState, setDrawingState] = useState<DrawingState>(INITIAL_DRAWING_STATE);
  
  /**
   * Reset drawing state to initial values
   */
  const resetDrawingState = useCallback(() => {
    setDrawingState(INITIAL_DRAWING_STATE);
  }, []);
  
  return {
    drawingState,
    setDrawingState,
    resetDrawingState
  };
};
