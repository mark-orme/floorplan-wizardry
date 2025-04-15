
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { InputMethod } from './useLineState';
import * as Sentry from '@sentry/react';

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
  // Function to cancel the current drawing operation - now returns a boolean
  const cancelDrawing = useCallback((): boolean => {
    if (!isDrawing) return false;
    
    try {
      // Set Sentry context for cancellation action
      Sentry.setTag("action", "cancelDrawing");
      Sentry.setContext("cancellationContext", {
        inputMethod,
        hasCurrentLine: !!currentLineRef.current,
        hasTooltip: !!distanceTooltipRef.current,
        timestamp: new Date().toISOString()
      });
      
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
      
      // Return true to indicate successful cancellation
      return true;
    } catch (error) {
      console.error('Error cancelling drawing:', error);
      
      // Log error in Sentry
      Sentry.setTag("errorSource", "drawingCancellation");
      Sentry.captureException(error);
      
      // Return false if cancellation fails
      return false;
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
  
  // Function to toggle grid snapping - explicitly return a boolean
  const toggleGridSnapping = useCallback((): boolean => {
    // Call the toggle function
    toggleSnap();
    
    // Set Sentry context for grid snapping action
    Sentry.setTag("action", "toggleGridSnapping");
    Sentry.setContext("gridSnapping", {
      previousState: snapEnabled,
      newState: !snapEnabled,
      timestamp: new Date().toISOString()
    });
    
    // Return the NEW state (after toggle)
    return !snapEnabled;
  }, [toggleSnap, snapEnabled]);
  
  return {
    cancelDrawing,
    toggleGridSnapping
  };
};
