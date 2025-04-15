
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Point } from '@/types/core/Geometry';

interface PencilState {
  pressure: number;
  tiltX: number;
  tiltY: number;
}

interface UseApplePencilSupportProps {
  canvas: FabricCanvas | null;
  lineThickness: number;
}

/**
 * Hook for Apple Pencil and other stylus support
 */
export const useApplePencilSupport = ({
  canvas,
  lineThickness
}: UseApplePencilSupportProps) => {
  const [pencilState, setPencilState] = useState<PencilState>({
    pressure: 1,
    tiltX: 0,
    tiltY: 0
  });
  const [isApplePencil, setIsApplePencil] = useState(false);
  
  // Calculate line thickness based on pressure with a smoother curve
  // This provides a more natural feel with a minimum and maximum range
  const adjustedLineThickness = Math.max(
    (pencilState.pressure * pencilState.pressure) * lineThickness * 1.2,
    lineThickness * 0.5 // Minimum thickness
  );
  
  // Handler for pointer events to detect Apple Pencil
  const handlePointerEvent = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      setIsApplePencil(true);
      
      // Update pressure state with smoother transition
      const newPressure = e.pressure || 1;
      setPencilState(prev => ({
        pressure: prev.pressure * 0.5 + newPressure * 0.5, // Smoother transition
        tiltX: e.tiltX || 0,
        tiltY: e.tiltY || 0
      }));
      
      // Prevent default handling that might interfere
      if (e.type === 'pointermove') {
        e.preventDefault();
      }
    } else {
      setIsApplePencil(false);
    }
  }, []);
  
  // Process touch events to extract Apple Pencil data
  const processPencilTouchEvent = useCallback((e: TouchEvent): { 
    isApplePencil: boolean;
    pressure: number;
  } => {
    let isApplePencil = false;
    let pressure = 1;
    
    try {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0] as any;
        
        // Apple Pencil provides force data
        if (typeof touch.force !== 'undefined') {
          pressure = Math.max(touch.force || 1, 0.5);
          
          if (pressure > 0) {
            isApplePencil = true;
            
            // Update pencil state with smoother transition
            setPencilState(prev => ({
              pressure: prev.pressure * 0.5 + pressure * 0.5, // Smoother transition
              tiltX: prev.tiltX,
              tiltY: prev.tiltY
            }));
            
            setIsApplePencil(true);
          }
        }
        
        // Some browsers provide touchType property
        if (touch.touchType && touch.touchType === 'stylus') {
          isApplePencil = true;
          setIsApplePencil(true);
        }
      }
    } catch (error) {
      console.error('Error detecting Apple Pencil:', error);
    }
    
    return { isApplePencil, pressure };
  }, []);
  
  // Snap to grid with smarter logic based on zoom level
  const snapPencilPointToGrid = useCallback((point: Point): Point => {
    if (!canvas || !isApplePencil) return point;
    
    try {
      // Determine grid size based on zoom level
      const zoom = canvas.getZoom();
      let gridSize = GRID_CONSTANTS.GRID_SIZE;
      
      // Scale grid size based on zoom to maintain usability
      if (zoom < 0.5) {
        gridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
      } else if (zoom > 2) {
        gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE / 2;
      }
      
      // Use a tighter snap threshold for pencil for more precision
      const pencilSnapThreshold = GRID_CONSTANTS.SNAP_THRESHOLD / 2;
      
      // Check if point is close to grid intersection
      const remainderX = point.x % gridSize;
      const remainderY = point.y % gridSize;
      
      const snappedX = remainderX < pencilSnapThreshold ? 
        point.x - remainderX : 
        (remainderX > gridSize - pencilSnapThreshold ? 
          point.x + (gridSize - remainderX) : 
          point.x);
          
      const snappedY = remainderY < pencilSnapThreshold ? 
        point.y - remainderY : 
        (remainderY > gridSize - pencilSnapThreshold ? 
          point.y + (gridSize - remainderY) : 
          point.y);
      
      return { x: snappedX, y: snappedY };
    } catch (error) {
      console.error('Error snapping pencil point to grid:', error);
      return point;
    }
  }, [canvas, isApplePencil]);
  
  // Determine if a point is precisely on the grid
  const isOnGrid = useCallback((point: Point): boolean => {
    if (!isApplePencil) return false;
    
    const gridSize = GRID_CONSTANTS.GRID_SIZE;
    const precision = 0.5; // Sub-pixel precision
    
    return (point.x % gridSize < precision || point.x % gridSize > gridSize - precision) &&
           (point.y % gridSize < precision || point.y % gridSize > gridSize - precision);
  }, [isApplePencil]);
  
  // Set up event listeners for the canvas
  useEffect(() => {
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    if (canvasElement) {
      canvasElement.addEventListener('pointerdown', handlePointerEvent);
      canvasElement.addEventListener('pointermove', handlePointerEvent);
      canvasElement.addEventListener('pointerup', handlePointerEvent);
      
      // Additional event for iOS detection
      canvasElement.addEventListener('touchstart', processPencilTouchEvent as any);
      
      // Apply iOS-specific fixes
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
      }
      
      return () => {
        canvasElement.removeEventListener('pointerdown', handlePointerEvent);
        canvasElement.removeEventListener('pointermove', handlePointerEvent);
        canvasElement.removeEventListener('pointerup', handlePointerEvent);
        canvasElement.removeEventListener('touchstart', processPencilTouchEvent as any);
        
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          document.removeEventListener('gesturestart', (e) => e.preventDefault());
          document.removeEventListener('gesturechange', (e) => e.preventDefault());
        }
      };
    }
  }, [canvas, handlePointerEvent, processPencilTouchEvent]);
  
  // Return enhanced functions for pencil support
  return {
    isApplePencil,
    adjustedLineThickness,
    pencilState,
    processPencilTouchEvent,
    snapPencilPointToGrid,
    isOnGrid
  };
};
