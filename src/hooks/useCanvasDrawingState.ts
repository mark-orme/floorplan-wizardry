
/**
 * Hook for managing drawing state
 * @module useCanvasDrawingState
 */
import { useState } from 'react';
import { DrawingState, createDefaultDrawingState } from '@/types/core/DrawingState';

/**
 * Hook for managing drawing state
 * @returns Drawing state and setter function
 */
export const useCanvasDrawingState = () => {
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());
  
  return {
    drawingState,
    setDrawingState
  };
};
