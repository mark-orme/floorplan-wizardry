
import { useCallback } from 'react';
import { useSnapToGrid } from '../useSnapToGrid';
import { Point } from '@/types/core/Point';

/**
 * Hook that provides grid snapping functionality for the canvas
 */
export const useGridSnapping = (fabricCanvasRef: React.MutableRefObject<any>) => {
  const snapToGridHook = useSnapToGrid({ fabricCanvasRef });
  
  // Destructure the hook to get all the functions
  const { snapPointToGrid, snapLineToGrid, snapEnabled, isSnappedToGrid, toggleSnapToGrid } = snapToGridHook;
  
  // Provide a wrapper function that can be used with event coordinates
  const snapEventToGrid = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return null;
    
    const pointer = fabricCanvasRef.current.getPointer(e);
    return snapPointToGrid({ x: pointer.x, y: pointer.y });
  }, [fabricCanvasRef, snapPointToGrid]);
  
  return {
    snapPointToGrid,
    snapLineToGrid,
    snapEventToGrid,
    snapEnabled,
    isSnappedToGrid,
    toggleSnapToGrid
  };
};
