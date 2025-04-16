
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useLineState } from './useLineState';
import { useLinePointerHandlers } from './useLinePointerHandlers';
import { useMeasurementUpdates } from './useMeasurementUpdates';

interface UseLineToolHandlersProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useLineToolHandlers = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineToolHandlersProps) => {
  // Refs for canvas
  const fabricCanvasRef = useRef<FabricCanvas | null>(canvas);
  
  // Update the fabricCanvasRef when canvas changes
  useEffect(() => {
    fabricCanvasRef.current = canvas;
  }, [canvas]);
  
  // Use line state hook for drawing state
  const lineState = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Use measurement updates hook
  const { measurementData, updateMeasurementData } = useMeasurementUpdates();
  
  // Use pointer handlers
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useLinePointerHandlers({
    canvas,
    enabled,
    isDrawing: lineState.isDrawing,
    startPoint: lineState.startPoint,
    snapEnabled: lineState.snapEnabled,
    anglesEnabled: lineState.anglesEnabled,
    startDrawing: lineState.startDrawing,
    continueDrawing: lineState.continueDrawing,
    completeDrawing: lineState.completeDrawing,
    setInputMethod: lineState.setInputMethod,
    updateMeasurementData
  });
  
  // Set up and clean up event handlers
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    const canvasElement = canvas.getElement();
    
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvas, enabled, handleMouseDown, handleMouseMove, handleMouseUp]);
  
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
    toggleAngles: lineState.toggleAngles,
    updateMeasurementData
  };
};
