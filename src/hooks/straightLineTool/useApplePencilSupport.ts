
import { useEffect } from 'react';
import { Canvas } from 'fabric';
import { SMALL_GRID_SIZE, LARGE_GRID_SIZE } from '@/constants/gridConstants';

interface UseApplePencilSupportProps {
  canvas: Canvas | null;
  snapToGrid: boolean;
}

/**
 * Hook to enable Apple Pencil support for snapping lines to grid
 */
export const useApplePencilSupport = ({ canvas, snapToGrid }: UseApplePencilSupportProps) => {
  useEffect(() => {
    if (!canvas) return;
    
    const handleTouch = (event: TouchEvent) => {
      if (event.touches && event.touches.length === 1) {
        const touch = event.touches[0];
        
        // Check if the touch is from an Apple Pencil - since touchType is not standard
        // we'll use a different approach to detect stylus input
        const isPencilLikely = event.pointerType === 'pen' || 'force' in touch;
        
        if (isPencilLikely) {
          // Get the coordinates of the touch relative to the canvas
          const canvasRect = canvas.getElement().getBoundingClientRect();
          const x = touch.clientX - canvasRect.left;
          const y = touch.clientY - canvasRect.top;
          
          // Snap the coordinates to the grid if snapToGrid is enabled
          if (snapToGrid) {
            const snapDistance = SMALL_GRID_SIZE / 2;
            const snappedX = Math.round(x / SMALL_GRID_SIZE) * SMALL_GRID_SIZE;
            const snappedY = Math.round(y / SMALL_GRID_SIZE) * SMALL_GRID_SIZE;
            
            // Instead of trying to modify read-only properties, dispatch a new touch event
            // with the corrected coordinates
            const newTouch = new Touch({
              identifier: touch.identifier,
              target: touch.target,
              clientX: snappedX + canvasRect.left,
              clientY: snappedY + canvasRect.top,
              screenX: touch.screenX,
              screenY: touch.screenY,
              pageX: snappedX + canvasRect.left + window.scrollX,
              pageY: snappedY + canvasRect.top + window.scrollY,
              radiusX: touch.radiusX || 1,
              radiusY: touch.radiusY || 1,
              rotationAngle: touch.rotationAngle || 0,
              force: touch.force || 0
            });
            
            // Update canvas based on snapped coordinates directly
            const snappedPoint = { x: snappedX, y: snappedY };
            if (canvas.freeDrawingBrush && canvas.isDrawingMode) {
              canvas.freeDrawingBrush.onMouseDown(snappedPoint);
            }
          }
        }
      }
    };
    
    // Add touch event listener to the canvas element
    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('touchstart', handleTouch, { passive: true });
    
    // Clean up the event listener when the component unmounts
    return () => {
      canvasElement.removeEventListener('touchstart', handleTouch);
    };
  }, [canvas, snapToGrid]);
};
