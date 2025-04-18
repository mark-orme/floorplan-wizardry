
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface TouchGestureHandlerProps {
  canvas: FabricCanvas;
  lineThickness: number;
  tool: DrawingMode;
}

export const TouchGestureHandler: React.FC<TouchGestureHandlerProps> = ({ 
  canvas, 
  lineThickness,
  tool 
}) => {
  const handlerAttachedRef = useRef(false);

  useEffect(() => {
    if (!canvas || handlerAttachedRef.current) return;
    
    // Add safety check to ensure canvas is fully initialized
    if (!canvas.wrapperEl) {
      console.log("Canvas wrapper element not ready yet, skipping touch handler setup");
      return;
    }

    try {
      console.log("Setting up touch gesture handlers for mobile");
      
      // Get canvas wrapper element safely
      const canvasWrapper = canvas.wrapperEl;
      if (!canvasWrapper) {
        console.warn("Canvas wrapper not found");
        return;
      }
      
      // Add mobile-specific classes
      canvasWrapper.classList.add('touch-optimized-canvas');
      
      // Setup touch handlers with safety checks
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          // Only prevent default for multi-touch to allow drawing with single touch
          e.preventDefault();
        }
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };
      
      // Attach event listeners to the canvas wrapper element
      canvasWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvasWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      // Mark handlers as attached to prevent duplicate attachment
      handlerAttachedRef.current = true;
      
      // Cleanup function
      return () => {
        if (canvasWrapper) {
          canvasWrapper.removeEventListener('touchstart', handleTouchStart);
          canvasWrapper.removeEventListener('touchmove', handleTouchMove);
          canvasWrapper.classList.remove('touch-optimized-canvas');
        }
        handlerAttachedRef.current = false;
      };
    } catch (error) {
      console.error("Error setting up touch handlers:", error);
    }
  }, [canvas, tool]);

  return null;
};
