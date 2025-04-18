
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';
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
  const initialPinchDistanceRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);

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
      
      // Get pinch distance between two touch points
      const getPinchDistance = (touches: TouchList): number => {
        if (touches.length < 2) return 0;
        
        const touch1 = touches[0];
        const touch2 = touches[1];
        
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        
        return Math.sqrt(dx * dx + dy * dy);
      };
      
      // Setup touch handlers with safety checks
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          // Store initial pinch distance for zoom
          initialPinchDistanceRef.current = getPinchDistance(e.touches);
          initialZoomRef.current = canvas.getZoom();
          
          // Only prevent default for multi-touch to allow drawing with single touch
          e.preventDefault();
        }
        
        // Make sure grid is visible
        const gridObjects = canvas.getObjects().filter(obj => 
          (obj as any).isGrid === true || (obj as any).objectType === 'grid'
        );
        
        if (gridObjects.length > 0) {
          gridObjects.forEach(obj => {
            obj.set({
              visible: true,
              opacity: 1
            });
          });
        }
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        // Handle pinch zoom
        if (e.touches.length > 1 && initialPinchDistanceRef.current !== null) {
          e.preventDefault();
          
          const currentDistance = getPinchDistance(e.touches);
          const scaleFactor = currentDistance / initialPinchDistanceRef.current;
          
          // Calculate center point
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          
          // Get canvas position
          const rect = canvasWrapper.getBoundingClientRect();
          const canvasX = centerX - rect.left;
          const canvasY = centerY - rect.top;
          
          // Apply zoom
          const newZoom = initialZoomRef.current * scaleFactor;
          
          // Limit zoom range
          const limitedZoom = Math.max(0.5, Math.min(3, newZoom));
          
          try {
            // Convert to fabric point
            const zoomPoint = new Point(canvasX, canvasY);
            canvas.zoomToPoint(zoomPoint, limitedZoom);
          } catch (error) {
            // Fallback if zoomToPoint fails
            canvas.setZoom(limitedZoom);
          }
          
          canvas.renderAll();
          return;
        }
        
        // For single touch in drawing mode, let fabric handle it
        if (e.touches.length === 1 && tool === DrawingMode.DRAW) {
          return;
        }
        
        // For other multi-touch gestures, prevent default browser behavior
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };
      
      const handleTouchEnd = (e: TouchEvent) => {
        // Reset pinch tracking
        initialPinchDistanceRef.current = null;
        
        // Make sure grid is still visible
        const gridObjects = canvas.getObjects().filter(obj => 
          (obj as any).isGrid === true || (obj as any).objectType === 'grid'
        );
        
        if (gridObjects.length > 0) {
          gridObjects.forEach(obj => {
            obj.set({
              visible: true,
              opacity: 1
            });
          });
          canvas.renderAll();
        }
      };
      
      // Attach event listeners to the canvas wrapper element
      canvasWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvasWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvasWrapper.addEventListener('touchend', handleTouchEnd);
      
      // Mark handlers as attached to prevent duplicate attachment
      handlerAttachedRef.current = true;
      
      // Cleanup function
      return () => {
        if (canvasWrapper) {
          canvasWrapper.removeEventListener('touchstart', handleTouchStart);
          canvasWrapper.removeEventListener('touchmove', handleTouchMove);
          canvasWrapper.removeEventListener('touchend', handleTouchEnd);
          canvasWrapper.classList.remove('touch-optimized-canvas');
        }
        handlerAttachedRef.current = false;
      };
    } catch (error) {
      console.error("Error setting up touch handlers:", error);
    }
  }, [canvas, tool]);

  // Force canvas rendering for mobile after component mounts
  useEffect(() => {
    if (!canvas) return;
    
    const renderTimer = setTimeout(() => {
      try {
        // Ensure grid is visible
        const gridObjects = canvas.getObjects().filter(obj => 
          (obj as any).isGrid === true || (obj as any).objectType === 'grid'
        );
        
        if (gridObjects.length > 0) {
          console.log(`Ensuring visibility of ${gridObjects.length} grid objects`);
          gridObjects.forEach(obj => {
            obj.set({
              visible: true,
              opacity: 1
            });
          });
        }
        
        canvas.renderAll();
      } catch (error) {
        console.error('Error forcing canvas render:', error);
      }
    }, 500);
    
    return () => clearTimeout(renderTimer);
  }, [canvas]);

  return null;
};
