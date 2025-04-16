
/**
 * Canvas drawing events hook
 * Combines drawing state, event handlers, and event attachment
 * @module hooks/canvas/drawing/useCanvasDrawingEvents
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingState } from './useDrawingState';
import { useEventHandlers } from './useEventHandlers';
import { useCanvasEventAttachment } from './useCanvasEventAttachment';

export interface UseCanvasDrawingEventsOptions {
  initialTool?: DrawingMode;
  initialColor?: string;
  initialThickness?: number;
  onDrawingStateChange?: (isDrawing: boolean) => void;
}

/**
 * Hook for canvas drawing events
 * @param canvas Fabric canvas instance
 * @param options Drawing options
 * @returns Drawing state and functions
 */
export const useCanvasDrawingEvents = (
  canvas: FabricCanvas | null,
  options: UseCanvasDrawingEventsOptions = {}
) => {
  const {
    initialTool = DrawingMode.SELECT,
    initialColor = '#000000',
    initialThickness = 2,
    onDrawingStateChange
  } = options;
  
  // Get drawing state and functions
  const {
    state,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    setActiveTool,
    setLineColor,
    setLineThickness
  } = useDrawingState(initialTool, initialColor, initialThickness);
  
  // Get event handlers
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useEventHandlers({
    canvas,
    activeTool: state.activeTool,
    isDrawing: state.isDrawing,
    onStartDrawing: startDrawing,
    onContinueDrawing: continueDrawing,
    onEndDrawing: endDrawing
  });
  
  // Attach event handlers to canvas
  useCanvasEventAttachment(
    canvas,
    { handleMouseDown, handleMouseMove, handleMouseUp },
    state.activeTool
  );
  
  // Notify about drawing state changes
  useEffect(() => {
    if (onDrawingStateChange) {
      onDrawingStateChange(state.isDrawing);
    }
  }, [state.isDrawing, onDrawingStateChange]);
  
  // Set canvas cursor based on active tool
  useEffect(() => {
    if (!canvas) return;
    
    switch (state.activeTool) {
      case DrawingMode.DRAW:
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.WALL:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'cell';
        canvas.hoverCursor = 'cell';
        break;
      case DrawingMode.PAN:
        canvas.defaultCursor = 'move';
        canvas.hoverCursor = 'move';
        break;
      default:
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'pointer';
        break;
    }
  }, [canvas, state.activeTool]);
  
  return {
    isDrawing: state.isDrawing,
    startPoint: state.startPoint,
    currentPoint: state.currentPoint,
    points: state.points,
    activeTool: state.activeTool,
    lineColor: state.lineColor,
    lineThickness: state.lineThickness,
    setActiveTool,
    setLineColor,
    setLineThickness,
    cancelDrawing
  };
};
