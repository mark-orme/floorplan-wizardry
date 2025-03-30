
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

  // Add debug logging for state changes
  const updateDrawingState = (updater: React.SetStateAction<DrawingState>) => {
    if (typeof updater === 'function') {
      setDrawingState(prevState => {
        const newState = updater(prevState);
        console.log("Drawing state updated:", newState);
        return newState;
      });
    } else {
      console.log("Drawing state set directly:", updater);
      setDrawingState(updater);
    }
  };

  return {
    drawingState,
    setDrawingState: updateDrawingState
  };
};
