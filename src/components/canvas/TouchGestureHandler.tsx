
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useApplePencilSupport } from '@/hooks/canvas/useApplePencilSupport';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

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
  const [isPencilActive, setIsPencilActive] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState<{x: number, y: number} | null>(null);
  const [drawingDistance, setDrawingDistance] = useState<number | null>(null);
  const [drawingAngle, setDrawingAngle] = useState<number | null>(null);
  
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
        
        // Update state based on detection
        setIsPencilActive(pencilData.isApplePencil);
        
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
          
          // Update coordinate display
          setCurrentCoordinates({x: snappedPoint.x, y: snappedPoint.y});
          
          // Calculate distance and angle if in drawing modes
          if ((tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.WALL) && 
              canvas.getActiveObject()) {
            const obj = canvas.getActiveObject();
            if (obj && obj.type === 'line') {
              const line = obj as any;
              const x1 = line.x1;
              const y1 = line.y1;
              const x2 = line.x2 || snappedPoint.x;
              const y2 = line.y2 || snappedPoint.y;
              
              // Calculate distance (in pixels, could be converted to real-world units)
              const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              setDrawingDistance(Math.round(distance));
              
              // Calculate angle
              const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
              setDrawingAngle(Math.round(angle));
            }
          }
        }
      } catch (error) {
        // Silent handling to not disturb drawing
        console.error('Error in pencil move handler:', error);
      }
    };
    
    // Reset measurements on touch end
    const handleTouchEnd = () => {
      setCurrentCoordinates(null);
      setDrawingDistance(null);
      setDrawingAngle(null);
    };
    
    // Set up event listeners
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasElement.addEventListener('touchmove', handlePencilMove, { passive: true });
    canvasElement.addEventListener('touchmove', preventPinchZoom, { passive: false });
    canvasElement.addEventListener('touchend', handleTouchEnd, { passive: true });
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
      
      // Display guidance once
      const hasShownPencilGuidance = localStorage.getItem('shownPencilGuidance');
      if (!hasShownPencilGuidance) {
        toast.info("Using Apple Pencil? Press lightly for thinner lines, firmly for thicker lines", {
          duration: 5000,
          id: "apple-pencil-guide"
        });
        localStorage.setItem('shownPencilGuidance', 'true');
      }
    }
    
    return () => {
      canvasElement.removeEventListener('touchstart', handleTouchStart);
      canvasElement.removeEventListener('touchmove', handlePencilMove);
      canvasElement.removeEventListener('touchmove', preventPinchZoom);
      canvasElement.removeEventListener('touchend', handleTouchEnd);
      canvasElement.removeEventListener('gesturestart', preventPinchZoom);
      canvasElement.removeEventListener('gesturechange', preventPinchZoom);
    };
  }, [canvas, isApplePencil, processPencilTouchEvent, snapPencilPointToGrid, tool]);
  
  // Render visual indicators for drawing
  return (
    <>
      {/* Pencil active indicator */}
      {isPencilActive && (
        <div className="fixed bottom-4 right-4 bg-white/80 text-black px-3 py-1 rounded-full text-xs font-medium shadow-md pointer-events-none">
          Pencil Active
        </div>
      )}
      
      {/* Live coordinates display */}
      {currentCoordinates && (
        <div className="fixed top-4 left-4 bg-white/80 text-black px-3 py-1 rounded-full text-xs font-medium shadow-md pointer-events-none">
          X: {Math.round(currentCoordinates.x)}, Y: {Math.round(currentCoordinates.y)}
        </div>
      )}
      
      {/* Live measurement display */}
      {drawingDistance && drawingAngle !== null && (
        <div className="fixed top-12 left-4 bg-white/80 text-black px-3 py-1 rounded-full text-xs font-medium shadow-md pointer-events-none">
          {drawingDistance}px • {drawingAngle}°
        </div>
      )}
      
      {/* Current tool indicator */}
      {tool && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/80 text-black px-3 py-1 rounded-full text-xs font-medium shadow-md pointer-events-none">
          {tool.charAt(0).toUpperCase() + tool.slice(1)} Tool
        </div>
      )}
    </>
  );
};
