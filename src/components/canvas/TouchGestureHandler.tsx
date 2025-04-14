
/**
 * Touch gesture handler component for iPad and Apple Pencil optimizations
 * @module components/canvas/TouchGestureHandler
 */
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useApplePencilSupport } from '@/hooks/straightLineTool/useApplePencilSupport';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { toast } from 'sonner';

interface TouchGestureHandlerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness?: number;
}

/**
 * Component to handle touch gestures with enhanced iPad and Apple Pencil support
 */
export const TouchGestureHandler: React.FC<TouchGestureHandlerProps> = ({
  fabricCanvasRef,
  lineThickness = 2
}) => {
  const { logDrawingEvent } = useDrawingErrorReporting();
  const detectedPencilRef = useRef(false);
  
  // Get Apple Pencil support from our hook
  const { 
    isApplePencil, 
    isPencilMode, 
    currentPressure,
    adjustedLineThickness
  } = useApplePencilSupport({
    fabricCanvasRef,
    lineThickness
  });
  
  // Show toast when Apple Pencil is first detected
  useEffect(() => {
    if (isApplePencil && !detectedPencilRef.current) {
      detectedPencilRef.current = true;
      toast.success("Apple Pencil detected! Pressure sensitivity enabled.", {
        duration: 3000,
        id: "apple-pencil-detected"
      });
      
      logDrawingEvent('Apple Pencil detected', 'stylus-connected', {
        interaction: {
          type: 'stylus',
          pressure: currentPressure
        }
      });
    }
  }, [isApplePencil, currentPressure, logDrawingEvent]);
  
  return null; // This is a non-visual component
};
