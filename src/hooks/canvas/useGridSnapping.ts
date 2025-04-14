
import { useCallback } from 'react';
import { useSnapToGrid } from '../useSnapToGrid';
import { Point } from '@/types/core/Point';

/**
 * Hook that provides grid snapping functionality for the canvas
 * @param fabricCanvasRef Reference to the fabric canvas
 * @param initialSnapEnabled Whether snap to grid is initially enabled
 * @returns Grid snapping functions and state
 */
export const useGridSnapping = (
  fabricCanvasRef: React.MutableRefObject<any>,
  initialSnapEnabled: boolean = true
) => {
  // Use the core snap to grid hook
  const snapToGridHook = useSnapToGrid({ 
    fabricCanvasRef,
    initialSnapEnabled
  });
  
  // Destructure the hook to get all the functions
  const { 
    snapPointToGrid, 
    snapLineToGrid, 
    isSnappedToGrid, 
    toggleSnapToGrid, 
    snapEnabled, 
    snapEventToGrid 
  } = snapToGridHook;
  
  // Add a convenience method for snapping mouse/touch events
  const snapPointerToGrid = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Get pointer position from event
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) {
        if (!e.changedTouches || e.changedTouches.length === 0) {
          return null;
        }
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Convert to canvas coordinates
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Apply canvas transformations
    const point = canvas.getPointer({ clientX, clientY } as MouseEvent);
    
    // Snap the point to grid
    return snapPointToGrid({ x: point.x, y: point.y });
  }, [fabricCanvasRef, snapPointToGrid]);
  
  return {
    snapPointToGrid,
    snapLineToGrid,
    snapEventToGrid,
    snapPointerToGrid,
    snapEnabled,
    isSnappedToGrid,
    toggleSnapToGrid
  };
};
