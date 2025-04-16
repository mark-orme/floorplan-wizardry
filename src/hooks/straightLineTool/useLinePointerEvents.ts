
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import logger from '@/utils/logger';

/**
 * Hook for managing pointer events for the line tool
 */
export const useLinePointerEvents = (
  canvas: FabricCanvas | null,
  isActive: boolean,
  startDrawing: (point: Point) => void,
  continueDrawing: (point: Point) => void,
  completeDrawing: (point: Point) => void,
  updateMeasurementData: (startPoint: Point, currentPoint: Point, snapEnabled: boolean, anglesEnabled: boolean) => void,
  startPoint: Point | null,
  snapEnabled: boolean,
  anglesEnabled: boolean,
  detectInputMethod?: (e: any) => void,
  saveCurrentState?: () => void
) => {
  /**
   * Handle pointer down event
   */
  const handlePointerDown = useCallback((e: any) => {
    if (!canvas || !isActive) return;
    
    // Prevent default to avoid selection
    e.e?.preventDefault();
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    
    // Start drawing
    startDrawing({ x: pointer.x, y: pointer.y });
    
    // Detect input method if available
    if (e.e && e.e.pointerType && detectInputMethod) {
      detectInputMethod(e.e);
    }
    
    // Log for debugging
    logger.debug('Pointer down', { pointer, isActive });
  }, [canvas, isActive, startDrawing, detectInputMethod]);
  
  /**
   * Handle pointer move event
   */
  const handlePointerMove = useCallback((e: any) => {
    if (!canvas || !startPoint) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    
    // Continue drawing
    continueDrawing({ x: pointer.x, y: pointer.y });
    
    // Update measurement data
    if (startPoint) {
      updateMeasurementData(
        startPoint,
        { x: pointer.x, y: pointer.y },
        snapEnabled,
        anglesEnabled
      );
    }
  }, [canvas, startPoint, continueDrawing, updateMeasurementData, snapEnabled, anglesEnabled]);
  
  /**
   * Handle pointer up event
   */
  const handlePointerUp = useCallback((e: any) => {
    if (!canvas || !startPoint) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    
    // Complete drawing
    completeDrawing({ x: pointer.x, y: pointer.y });
    
    // Save current state for undo/redo
    if (saveCurrentState) {
      saveCurrentState();
    }
  }, [canvas, startPoint, completeDrawing, saveCurrentState]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
