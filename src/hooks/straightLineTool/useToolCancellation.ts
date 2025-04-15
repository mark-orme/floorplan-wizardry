
/**
 * Hook for managing drawing cancellation
 * @module hooks/straightLineTool/useToolCancellation
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { toast } from 'sonner';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { InputMethod } from './useLineState';

interface UseToolCancellationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isDrawing: boolean;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<any | null>;
  setIsDrawing: (isDrawing: boolean) => void;
  resetDrawingState: () => void;
  inputMethod: InputMethod;
  toggleSnap: () => void;
  snapEnabled: boolean;
}

/**
 * Hook for managing drawing cancellation and grid snapping
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
  // Get the error reporting hook
  const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();

  // Cancel drawing (e.g. on Escape key)
  const cancelDrawing = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing) return;
    
    try {
      // Remove temporary line
      if (currentLineRef.current) {
        fabricCanvasRef.current.remove(currentLineRef.current);
      }
      
      // Remove distance tooltip if it exists
      if (distanceTooltipRef.current) {
        fabricCanvasRef.current.remove(distanceTooltipRef.current);
      }
      
      // Reset state
      setIsDrawing(false);
      
      // Reset drawing state
      resetDrawingState();
      
      // Render changes
      fabricCanvasRef.current.renderAll();
      
      // Log event
      logDrawingEvent('Line drawing cancelled', 'line-cancel', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
      
      toast.info("Line drawing cancelled");
    } catch (error) {
      reportDrawingError(error, 'line-cancel', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    distanceTooltipRef, 
    setIsDrawing, 
    resetDrawingState, 
    logDrawingEvent,
    reportDrawingError,
    inputMethod
  ]);

  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    toggleSnap();
    
    logDrawingEvent(`Grid snapping ${snapEnabled ? 'disabled' : 'enabled'}`, 'toggle-grid-snap', {
      interaction: { type: inputMethod }
    });
  }, [toggleSnap, snapEnabled, logDrawingEvent, inputMethod]);

  return {
    cancelDrawing,
    toggleGridSnapping
  };
};
