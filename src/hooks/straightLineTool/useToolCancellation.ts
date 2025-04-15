
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Line } from 'fabric';
import { InputMethod } from './useLineState';
import { toast } from 'sonner';

interface UseToolCancellationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isDrawing: boolean;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<HTMLDivElement | null>;
  setIsDrawing: (isDrawing: boolean) => void;
  resetDrawingState: () => void;
  inputMethod: InputMethod;
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
  // Cancel the drawing operation
  const cancelDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    console.log('Cancelling drawing operation');
    
    // Reset the drawing state
    setIsDrawing(false);
    
    // Remove the current line from the canvas
    if (currentLineRef.current && fabricCanvasRef.current) {
      fabricCanvasRef.current.remove(currentLineRef.current);
      fabricCanvasRef.current.renderAll();
    }
    
    // Clean up the tooltip if it exists
    if (distanceTooltipRef.current) {
      const parent = distanceTooltipRef.current.parentElement;
      if (parent) {
        parent.removeChild(distanceTooltipRef.current);
      }
    }
    
    // Reset all references
    resetDrawingState();
    
    // Show feedback to user
    toast.info('Drawing cancelled', {
      id: 'drawing-cancelled',
      duration: 2000
    });
  }, [isDrawing, setIsDrawing, currentLineRef, fabricCanvasRef, distanceTooltipRef, resetDrawingState]);

  // Toggle grid snapping and return current state
  const toggleGridSnapping = useCallback(() => {
    toggleSnap();
    // Return the new state (opposite of current snapEnabled value)
    return !snapEnabled;
  }, [toggleSnap, snapEnabled]);
  
  return {
    cancelDrawing,
    toggleGridSnapping
  };
};
