
import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Line, Point, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineState, InputMethod } from './useLineState';
import { useLineEvents } from './useLineEvents';
import { toast } from 'sonner';
import { captureMessage, captureError } from '@/utils/sentryUtils';

/**
 * Props for the useStraightLineTool hook
 */
interface StraightLineToolProps {
  canvas: FabricCanvas;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for managing the straight line drawing tool
 */
export const useStraightLineTool = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: StraightLineToolProps) => {
  // Create a stable reference to the canvas
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  fabricCanvasRef.current = canvas;
  
  // Debug message to confirm the hook is being used
  useEffect(() => {
    if (enabled) {
      console.log("Straight line tool enabled with color:", lineColor, "and thickness:", lineThickness);
      captureMessage("Straight line tool activated", "tool-activation");
    }
  }, [enabled, lineColor, lineThickness]);
  
  // Initialize line state with the line properties
  const lineState = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Set up line events
  const lineEvents = useLineEvents({
    fabricCanvasRef,
    lineState,
    onComplete: saveCurrentState,
    enabled
  });

  // Reference to the current line
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  // Cancel drawing function
  const cancelDrawing = useCallback(() => {
    if (fabricCanvasRef.current && lineState.currentLineRef.current) {
      fabricCanvasRef.current.remove(lineState.currentLineRef.current);
      
      if (lineState.distanceTooltipRef.current) {
        fabricCanvasRef.current.remove(lineState.distanceTooltipRef.current);
      }
      
      lineState.resetDrawingState();
      fabricCanvasRef.current.requestRenderAll();
    }
  }, [lineState, fabricCanvasRef]);

  // Pointer event handlers
  const handlePointerDown = useCallback((point: {x: number, y: number}) => {
    lineEvents.handleMouseDown({pointer: point, e: {preventDefault: () => {}}});
  }, [lineEvents]);

  const handlePointerMove = useCallback((point: {x: number, y: number}) => {
    lineEvents.handleMouseMove({pointer: point, e: {preventDefault: () => {}}});
  }, [lineEvents]);

  const handlePointerUp = useCallback((point: {x: number, y: number}) => {
    lineEvents.handleMouseUp({pointer: point, e: {preventDefault: () => {}}});
  }, [lineEvents]);

  // Toggle functions
  const toggleGridSnapping = useCallback(() => {
    lineState.toggleSnap();
    toast.info(lineState.snapEnabled ? 'Grid snapping enabled' : 'Grid snapping disabled');
  }, [lineState]);

  const toggleAngles = useCallback(() => {
    lineState.toggleAngles();
    toast.info(lineState.anglesEnabled ? 'Angle snapping enabled' : 'Angle snapping disabled');
  }, [lineState]);
  
  // Return the line state and events
  return {
    ...lineState,
    ...lineEvents,
    isEnabled: enabled,
    isActive: enabled,
    inputMethod: lineState.inputMethod,
    isPencilMode: lineState.isPencilMode,
    snapEnabled: lineState.snapEnabled,
    anglesEnabled: lineState.anglesEnabled,
    measurementData: lineState.measurementData,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping,
    toggleAngles,
    currentLine
  };
};

// Export the necessary items for testing and component use
export { useLineState, InputMethod } from './useLineState';
