
/**
 * Hook for managing canvas drawing state
 * @module canvas/drawing/useCanvasDrawingState
 */
import { useState } from 'react';
import { DrawingState } from '@/types/core/DrawingState';
import { createDefaultDrawingState } from '@/types/core/DrawingState';

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
