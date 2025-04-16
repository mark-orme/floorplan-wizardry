
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './useLineInputMethod';

interface UseLinePointerHandlersProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  isDrawing: boolean;
  startPoint: Point | null;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  completeDrawing: (point: Point) => void;
  setInputMethod: (method: InputMethod) => void;
  updateMeasurementData: (start: Point, current: Point, snapEnabled: boolean, anglesEnabled: boolean) => void;
}

/**
 * Hook for handling pointer events for line tool
 */
export const useLinePointerHandlers = ({
  canvas,
  enabled,
  isDrawing,
  startPoint,
  snapEnabled,
  anglesEnabled,
  startDrawing,
  continueDrawing,
  completeDrawing,
  setInputMethod,
  updateMeasurementData
}: UseLinePointerHandlersProps) => {
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled || !canvas) return;
    
    // Get canvas position
    const rect = canvas.getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Start drawing
    startDrawing({ x, y });
    
    // Set input method based on pointer type
    if (e instanceof PointerEvent) {
      setInputMethod(e.pointerType === 'pen' ? InputMethod.PENCIL : InputMethod.MOUSE);
    }
  }, [canvas, enabled, startDrawing, setInputMethod]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDrawing || !startPoint || !canvas) return;
    
    // Get canvas position
    const rect = canvas.getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const point = { x, y };
    
    // Continue drawing
    continueDrawing(point);
    
    // Update measurement data
    updateMeasurementData(startPoint, point, snapEnabled, anglesEnabled);
    
    // Check for shift key
    if (e instanceof KeyboardEvent) {
      const shiftPressed = e.shiftKey;
      // We could handle shift key here if needed
    }
  }, [isDrawing, startPoint, canvas, continueDrawing, updateMeasurementData, snapEnabled, anglesEnabled]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDrawing || !startPoint || !canvas) return;
    
    // Get canvas position
    const rect = canvas.getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Complete drawing
    completeDrawing({ x, y });
  }, [isDrawing, startPoint, canvas, completeDrawing]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
