
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useApplePencilSupport } from '@/hooks/canvas/useApplePencilSupport';
import { DrawingMode } from '@/constants/drawingModes';

interface TouchGestureHandlerProps {
  canvas: FabricCanvas | null;
  lineThickness?: number;
  tool?: DrawingMode;
}

export const TouchGestureHandler: React.FC<TouchGestureHandlerProps> = ({ 
  canvas, 
  lineThickness = 2,
  tool = DrawingMode.SELECT
}) => {
  const lastTouchRef = useRef<Touch | null>(null);
  
  // Use Apple Pencil support hook
  const { 
    isApplePencil,
    adjustedLineThickness,
    processPencilTouchEvent,
    snapPencilPointToGrid 
  } = useApplePencilSupport({
    canvas,
    lineThickness
  });
  
  // Set up touch gesture handling
  useEffect(() => {
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    // Handle gesture events to prevent unwanted behaviors
    const preventPinchZoom = (e: TouchEvent) => {
      // Only prevent if we're in drawing mode
      if (canvas.isDrawingMode) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }
    };
    
    // Handle palm rejection for Apple Pencil
    const handleTouchStart = (e: TouchEvent) => {
      try {
        // Process the event to detect Apple Pencil
        const pencilData = processPencilTouchEvent(e);
        
        // Store touch for palm rejection
        if (pencilData.isApplePencil && e.touches[0]) {
          lastTouchRef.current = e.touches[0];
        }
      } catch (error) {
        console.error('Error in touch handler:', error);
      }
    };
    
    // Improve pencil precision by snapping to grid
    const handlePencilMove = (e: TouchEvent) => {
      if (!isApplePencil) return;
      
      try {
        // Process touch to confirm it's a pencil
        const pencilData = processPencilTouchEvent(e);
        
        if (pencilData.isApplePencil && e.touches && e.touches[0]) {
          const touch = e.touches[0];
          
          // Get position
          const point = canvas.getPointer({ clientX: touch.clientX, clientY: touch.clientY } as any);
          
          // Snap to grid if needed
          const snappedPoint = snapPencilPointToGrid(point);
          
          // Store for palm rejection
          lastTouchRef.current = touch;
        }
      } catch (error) {
        // Silent handling to not disturb drawing
        console.error('Error in pencil move handler:', error);
      }
    };
    
    // Set up event listeners
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasElement.addEventListener('touchmove', handlePencilMove, { passive: true });
    canvasElement.addEventListener('touchmove', preventPinchZoom, { passive: false });
    canvasElement.addEventListener('gesturestart', preventPinchZoom, { passive: false });
    canvasElement.addEventListener('gesturechange', preventPinchZoom, { passive: false });
    
    // iOS-specific fixes
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Add meta viewport to disable scaling
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    return () => {
      canvasElement.removeEventListener('touchstart', handleTouchStart);
      canvasElement.removeEventListener('touchmove', handlePencilMove);
      canvasElement.removeEventListener('touchmove', preventPinchZoom);
      canvasElement.removeEventListener('gesturestart', preventPinchZoom);
      canvasElement.removeEventListener('gesturechange', preventPinchZoom);
    };
  }, [canvas, isApplePencil, processPencilTouchEvent, snapPencilPointToGrid, tool]);
  
  // This is a non-visual component, so return null
  return null;
};
