
/**
 * Hook for managing canvas drawing state
 * @module canvas/drawing/useCanvasDrawingState
 */
import { useState } from 'react';
import { DrawingState, createDefaultDrawingState } from '@/types/drawingTypes';

/**
 * Hook for managing the drawing state in canvas operations
 * @returns Drawing state and setter
 */
export const useCanvasDrawingState = () => {
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());

  return {
    drawingState,
    setDrawingState
  };
};
