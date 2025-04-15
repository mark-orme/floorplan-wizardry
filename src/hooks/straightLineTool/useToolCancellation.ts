
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseToolCancellationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isDrawing: boolean;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<any | null>;
  setIsDrawing: (isDrawing: boolean) => void;
  resetDrawingState: () => void;
  inputMethod: 'mouse' | 'touch' | 'pencil';
  toggleSnap: () => void;
  snapEnabled: boolean;
}

export const useToolCancellation = ({
  fabricCanvasRef,
  isDrawing,
  currentLineRef,
  distanceTooltipRef,
  setIsDrawing,
  resetDrawingState,
  inputMethod,
  toggleSnap,
  snapEnabled
}: UseToolCancellationProps) => {
  // Cancel the current drawing operation
  const cancelDrawing = useCallback(() => {
    if (!isDrawing) return false;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    // Remove the current line object if it exists
    if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
      canvas.remove(currentLineRef.current);
    }
    
    // Remove the distance tooltip if it exists
    if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // Reset drawing state
    setIsDrawing(false);
    resetDrawingState();
    
    // Refresh the canvas
    canvas.requestRenderAll();
    
    return true;
  }, [fabricCanvasRef, isDrawing, currentLineRef, distanceTooltipRef, setIsDrawing, resetDrawingState]);
  
  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    toggleSnap();
    return true;
  }, [toggleSnap]);
  
  return {
    cancelDrawing,
    toggleGridSnapping
  };
};
