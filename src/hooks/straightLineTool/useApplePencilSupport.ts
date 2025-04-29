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
        
        // Check if the touch is from an Apple Pencil
        if (touch.touchType === 'stylus') {
          // Get the coordinates of the touch relative to the canvas
          const canvasRect = canvas.getElement().getBoundingClientRect();
          const x = touch.clientX - canvasRect.left;
          const y = touch.clientY - canvasRect.top;
          
          // Snap the coordinates to the grid if snapToGrid is enabled
          if (snapToGrid) {
            const snapDistance = SMALL_GRID_SIZE / 2;
            const snappedX = Math.round(x / SMALL_GRID_SIZE) * SMALL_GRID_SIZE;
            const snappedY = Math.round(y / SMALL_GRID_SIZE) * SMALL_GRID_SIZE;
            
            // Update the touch coordinates with the snapped values
            touch.clientX = snappedX + canvasRect.left;
            touch.clientY = snappedY + canvasRect.top;
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
