
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Hook for handling pointer events for line drawing
 */
export const useLinePointerEvents = (
  canvas: FabricCanvas | null,
  isActive: boolean,
  startDrawing: (point: Point) => void,
  continueDrawing: (point: Point) => void,
  completeDrawing: (point: Point) => void,
  updateMeasurement: (startPoint: Point, currentPoint: Point, snapEnabled: boolean, anglesEnabled: boolean) => void,
  startPoint: Point | null,
  snapEnabled: boolean,
  anglesEnabled: boolean,
  updateInputMethod: (pointerType: string) => void,
  saveCurrentState: () => void
) => {
  /**
   * Handle pointer down
   */
  const handlePointerDown = useCallback((event: any) => {
    if (!isActive || !canvas) return;
    
    // Get pointer position
    const pointer = event.pointer as Point;
    if (!pointer) return;
    
    // Update input method if available
    if (event.e?.pointerType) {
      updateInputMethod(event.e.pointerType);
    }
    
    // Start drawing
    startDrawing(pointer);
  }, [isActive, canvas, startDrawing, updateInputMethod]);
  
  /**
   * Handle pointer move
   */
  const handlePointerMove = useCallback((event: any) => {
    if (!isActive || !canvas || !startPoint) return;
    
    // Get pointer position
    const pointer = event.pointer as Point;
    if (!pointer) return;
    
    // Continue drawing
    continueDrawing(pointer);
    
    // Update measurement
    updateMeasurement(startPoint, pointer, snapEnabled, anglesEnabled);
  }, [isActive, canvas, startPoint, continueDrawing, updateMeasurement, snapEnabled, anglesEnabled]);
  
  /**
   * Handle pointer up
   */
  const handlePointerUp = useCallback((event: any) => {
    if (!isActive || !canvas) return;
    
    // Get pointer position
    const pointer = event.pointer as Point;
    if (!pointer) return;
    
    // Complete drawing
    completeDrawing(pointer);
    
    // Save current state
    saveCurrentState();
  }, [isActive, canvas, completeDrawing, saveCurrentState]);
  
  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
