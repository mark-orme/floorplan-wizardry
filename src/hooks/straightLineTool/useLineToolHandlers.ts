
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../useStraightLineTool.d';
import { useLineState } from './useLineState';
import { InputMethod } from './useLineInputMethod';
import { useMeasurementUpdates } from './useMeasurementUpdates';

interface UseLineToolHandlersProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for handling line tool events
 */
export const useLineToolHandlers = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineToolHandlersProps) => {
  // Create a cursor position ref
  const cursorPositionRef = useRef<Point | null>(null);
  
  // Get line state from the main hook
  const lineState = useLineState({
    fabricCanvasRef: { current: canvas },
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Get measurement update functionality
  const { updateMeasurementData } = useMeasurementUpdates();
  
  // Measurement data state
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });
  
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((event: any) => {
    if (!enabled || !canvas) return;
    
    // Get pointer position
    const pointer = event.pointer as Point;
    if (!pointer) return;
    
    // Update input method
    lineState.setInputMethod(
      event.e?.pointerType === 'pen' ? InputMethod.PENCIL : InputMethod.MOUSE
    );
    
    // Start drawing
    lineState.startDrawing(pointer);
    
    // Update cursor position
    cursorPositionRef.current = pointer;
    
    // Update measurement data
    if (lineState.startPoint) {
      const measurement = updateMeasurementData(
        lineState.startPoint,
        pointer,
        lineState.snapEnabled,
        lineState.anglesEnabled
      );
      setMeasurementData(measurement);
    }
  }, [enabled, canvas, lineState, updateMeasurementData]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((event: any) => {
    if (!enabled || !canvas || !lineState.isDrawing) return;
    
    // Get pointer position
    const pointer = event.pointer as Point || event.e?.offsetPoint as Point;
    if (!pointer) return;
    
    // Continue drawing
    lineState.continueDrawing(pointer);
    
    // Update cursor position
    cursorPositionRef.current = pointer;
    
    // Update measurement data
    if (lineState.startPoint) {
      const measurement = updateMeasurementData(
        lineState.startPoint,
        lineState.currentPoint || pointer,
        lineState.snapEnabled,
        lineState.anglesEnabled
      );
      setMeasurementData(measurement);
    }
  }, [enabled, canvas, lineState, updateMeasurementData]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((event: any) => {
    if (!enabled || !canvas || !lineState.isDrawing) return;
    
    // Get pointer position
    const pointer = event.pointer as Point || cursorPositionRef.current;
    if (!pointer) return;
    
    // Complete drawing
    lineState.completeDrawing(pointer);
    
    // Reset cursor position
    cursorPositionRef.current = null;
    
    // Save current state
    saveCurrentState();
  }, [enabled, canvas, lineState, saveCurrentState]);
  
  return {
    isActive: lineState.isActive,
    inputMethod: lineState.inputMethod,
    isPencilMode: lineState.isPencilMode,
    snapEnabled: lineState.snapEnabled,
    anglesEnabled: lineState.anglesEnabled,
    shiftKeyPressed: lineState.shiftKeyPressed,
    measurementData,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleGridSnapping: lineState.toggleSnap,
    toggleAngles: lineState.toggleAngles
  };
};
