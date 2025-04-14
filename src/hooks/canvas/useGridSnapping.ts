
import { useCallback } from 'react';
import { useSnapToGrid } from '../useSnapToGrid';
import { Point } from '@/types/core/Point';

/**
 * Hook that provides grid snapping functionality for the canvas
 */
export const useGridSnapping = (fabricCanvasRef: React.MutableRefObject<any>) => {
  const snapToGridHook = useSnapToGrid({ fabricCanvasRef });
  
  // Destructure the hook to get all the functions
  const { snapPointToGrid, snapLineToGrid, isSnappedToGrid, toggleSnapToGrid, snapEnabled, snapEventToGrid } = snapToGridHook;
  
  return {
    snapPointToGrid,
    snapLineToGrid,
    snapEventToGrid,
    snapEnabled,
    isSnappedToGrid,
    toggleSnapToGrid
  };
};
