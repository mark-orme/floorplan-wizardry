
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

interface PointerEventData {
  pointer?: Point;
  e?: {
    pointerType?: string;
  };
}

/**
 * Hook for handling pointer events for line drawing
 */
export const useLinePointerHandlers = (
  startDrawing: (point: Point) => void,
  continueDrawing: (point: Point) => void,
  completeDrawing: (point: Point) => void,
  updateInputMethod: (pointerType: string) => void
) => {
  /**
   * Handle pointer down event
   */
  const handlePointerDown = useCallback((event: PointerEventData) => {
    if (!event.pointer) return;
    
    // Update input method based on pointer type
    if (event.e?.pointerType) {
      updateInputMethod(event.e.pointerType);
    }
    
    // Start drawing
    startDrawing(event.pointer);
  }, [startDrawing, updateInputMethod]);
  
  /**
   * Handle pointer move event
   */
  const handlePointerMove = useCallback((event: PointerEventData) => {
    if (!event.pointer) return;
    
    // Continue drawing
    continueDrawing(event.pointer);
  }, [continueDrawing]);
  
  /**
   * Handle pointer up event
   */
  const handlePointerUp = useCallback((event: PointerEventData) => {
    if (!event.pointer) return;
    
    // Complete drawing
    completeDrawing(event.pointer);
  }, [completeDrawing]);
  
  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
