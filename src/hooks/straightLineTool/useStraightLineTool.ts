
import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Line, Point, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineState } from './useLineState';
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
  
  // Return the line state and events
  return {
    ...lineState,
    ...lineEvents,
    isEnabled: enabled
  };
};
