
/**
 * Hook for cancelling the drawing tool and handling ESC key
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { InputMethod } from './useLineState';

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

/**
 * Hook for cancelling the current drawing operation
 * Also handles toggling grid snapping
 */
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
  // Function to cancel the current drawing operation
  const cancelDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    try {
      // If we have a current line being drawn, remove it
      if (currentLineRef.current && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(currentLineRef.current);
        fabricCanvasRef.current.renderAll();
      }
      
      // Clear the current line reference to avoid artifacts
      currentLineRef.current = null;
      
      // Remove distance tooltip
      if (distanceTooltipRef.current) {
        const parent = distanceTooltipRef.current.parentElement;
        if (parent) {
          parent.removeChild(distanceTooltipRef.current);
        }
        distanceTooltipRef.current = null;
      }
      
      // Reset state
      setIsDrawing(false);
      resetDrawingState();
      
      console.log(`Drawing cancelled via ESC key (input: ${inputMethod})`);
    } catch (error) {
      console.error('Error cancelling drawing:', error);
    }
  }, [
    fabricCanvasRef,
    isDrawing,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    resetDrawingState,
    inputMethod
  ]);
  
  // Function to toggle grid snapping - modified to return a boolean
  const toggleGridSnapping = useCallback((): boolean => {
    // Call the toggle function
    toggleSnap();
    
    // Return the NEW state (after toggle)
    return !snapEnabled;
  }, [toggleSnap, snapEnabled]);
  
  return {
    cancelDrawing,
    toggleGridSnapping
  };
};
