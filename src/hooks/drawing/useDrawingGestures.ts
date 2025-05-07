
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

export interface UseDrawingGesturesProps {
  canvas?: FabricCanvas | null;
  enabled?: boolean;
}

export const useDrawingGestures = ({
  canvas,
  enabled = true
}: UseDrawingGesturesProps) => {
  // Track pinch zoom gesture
  const setupPinchZoom = useCallback(() => {
    if (!canvas || !enabled) return;

    let initialDistance = 0;
    let initialZoom = 1;
    
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;
      
      // Calculate initial distance between touch points
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      // Add null checks for touch points
      if (!touch1 || !touch2) return;
      
      initialDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Store current zoom level
      initialZoom = canvas.getZoom?.() || 1;
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || initialDistance === 0) return;
      
      // Calculate new distance between touch points
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      // Add null checks for touch points
      if (!touch1 || !touch2) return;
      
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate zoom factor
      const zoomFactor = currentDistance / initialDistance;
      
      // Apply zoom, but limit to reasonable bounds (0.5 to 5)
      const newZoom = Math.min(Math.max(initialZoom * zoomFactor, 0.5), 5);
      
      // Calculate the zoom point (midpoint between touches)
      const midpoint: Point = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
      
      // Convert point from screen coordinates to canvas coordinates
      const canvasElement = canvas.getElement();
      const rect = canvasElement.getBoundingClientRect();
      const canvasPoint: Point = {
        x: (midpoint.x - rect.left) / (canvas.getZoom?.() || 1),
        y: (midpoint.y - rect.top) / (canvas.getZoom?.() || 1)
      };
      
      // Apply zoom if zoomToPoint is available
      if (canvas.zoomToPoint) {
        canvas.zoomToPoint(canvasPoint as any, newZoom);
      }
      
      // Prevent default to avoid browser zooming
      event.preventDefault();
    };
    
    const handleTouchEnd = () => {
      initialDistance = 0;
    };
    
    // Add event listeners to the canvas element
    const canvasElement = canvas.getElement().parentElement;
    if (canvasElement) {
      canvasElement.addEventListener('touchstart', handleTouchStart);
      canvasElement.addEventListener('touchmove', handleTouchMove);
      canvasElement.addEventListener('touchend', handleTouchEnd);
    }
    
    // Cleanup function
    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('touchstart', handleTouchStart);
        canvasElement.removeEventListener('touchmove', handleTouchMove);
        canvasElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [canvas, enabled]);
  
  // Set up gestures when canvas or enabled state changes
  useEffect(() => {
    const cleanup = setupPinchZoom();
    return cleanup;
  }, [setupPinchZoom]);
  
  return {
    isGesturesEnabled: enabled
  };
};
