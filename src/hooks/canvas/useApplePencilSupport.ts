
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

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
  
  // Calculate line thickness based on pressure
  const adjustedLineThickness = Math.max(
    pencilState.pressure * lineThickness,
    lineThickness * 0.5 // Minimum thickness
  );
  
  // Handler for pointer events to detect Apple Pencil
  const handlePointerEvent = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      setIsApplePencil(true);
      
      // Update pressure state
      setPencilState({
        pressure: e.pressure || 1,
        tiltX: e.tiltX || 0,
        tiltY: e.tiltY || 0
      });
      
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
            
            // Update pencil state
            setPencilState(prev => ({
              ...prev,
              pressure
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
  
  // Snap to grid for precise stylus input
  const snapPencilPointToGrid = useCallback((point: { x: number, y: number }) => {
    if (!isApplePencil) return point;
    
    const gridSize = GRID_CONSTANTS.GRID_SIZE;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [isApplePencil]);
  
  // Set up event listeners for the canvas
  useEffect(() => {
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    if (canvasElement) {
      canvasElement.addEventListener('pointerdown', handlePointerEvent);
      canvasElement.addEventListener('pointermove', handlePointerEvent);
      
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
        canvasElement.removeEventListener('touchstart', processPencilTouchEvent as any);
        
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          document.removeEventListener('gesturestart', (e) => e.preventDefault());
          document.removeEventListener('gesturechange', (e) => e.preventDefault());
        }
      };
    }
  }, [canvas, handlePointerEvent, processPencilTouchEvent]);
  
  return {
    isApplePencil,
    adjustedLineThickness,
    processPencilTouchEvent,
    snapPencilPointToGrid
  };
};
