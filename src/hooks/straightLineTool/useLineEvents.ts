
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineDrawing } from './useLineDrawing';
import { captureError, captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';
import { 
  FabricMouseDownEvent, 
  FabricMouseMoveEvent, 
  FabricMouseUpEvent,
  FabricEventTypes
} from '@/types/fabric-events';

/**
 * Hook for handling straight line drawing events
 */
export const useLineEvents = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  tool: DrawingMode,
  lineColor: string,
  lineThickness: number,
  saveCurrentState: () => void,
  lineState: any
) => {
  const {
    isDrawing,
    setIsDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    resetDrawingState,
    setStartPoint
  } = lineState;
  
  const {
    snapPointToGrid,
    createLine,
    updateLine,
    createOrUpdateTooltip,
    finalizeLine,
    removeLine
  } = useLineDrawing(fabricCanvasRef, lineColor, lineThickness, saveCurrentState);
  
  // Handle mouse down to start drawing
  const handleMouseDown = useCallback((event: FabricMouseDownEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || tool !== DrawingMode.STRAIGHT_LINE) return;
    
    try {
      // Get the pointer coordinates from the event
      const pointer = canvas.getPointer(event.e);
      logger.info("Mouse down in straight line tool", { x: pointer.x, y: pointer.y });
      
      // Snap to grid
      const snappedPoint = snapPointToGrid({
        x: pointer.x,
        y: pointer.y
      });
      
      // Store starting point and set drawing state
      setStartPoint(snappedPoint);
      
      // Create initial line
      const line = createLine(snappedPoint.x, snappedPoint.y);
      if (line) {
        currentLineRef.current = line;
      }
      
      captureMessage("Started drawing straight line", "straight-line-start", {
        extra: { position: snappedPoint, color: lineColor, thickness: lineThickness }
      });
      
      // Prevent event propagation
      if (event.e.stopPropagation) event.e.stopPropagation();
    } catch (error) {
      captureError(error as Error, "straight-line-mousedown-error");
      logger.error("Error handling mouse down in straight line tool", error);
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness, snapPointToGrid, createLine, setStartPoint, currentLineRef]);
  
  // Handle mouse move to update line
  const handleMouseMove = useCallback((event: FabricMouseMoveEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !startPointRef.current || !currentLineRef.current) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap end point to grid
      const snappedPoint = snapPointToGrid({
        x: pointer.x,
        y: pointer.y
      });
      
      // Update the line
      const updateInfo = updateLine(
        currentLineRef.current,
        startPointRef.current.x,
        startPointRef.current.y,
        snappedPoint.x,
        snappedPoint.y
      );
      
      if (updateInfo) {
        // Create or update tooltip
        const tooltip = createOrUpdateTooltip(
          distanceTooltipRef,
          `${updateInfo.distanceInMeters}m`,
          updateInfo.tooltipPosition.x,
          updateInfo.tooltipPosition.y
        );
        
        if (tooltip) {
          distanceTooltipRef.current = tooltip;
        }
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      captureError(error as Error, "straight-line-mousemove-error");
      logger.error("Error handling mouse move in straight line tool", error);
    }
  }, [
    fabricCanvasRef,
    isDrawing,
    tool,
    snapPointToGrid,
    updateLine,
    createOrUpdateTooltip,
    startPointRef,
    currentLineRef,
    distanceTooltipRef
  ]);
  
  // Handle mouse up to complete line drawing
  const handleMouseUp = useCallback((event: FabricMouseUpEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !startPointRef.current || !currentLineRef.current) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap end point to grid
      const snappedPoint = snapPointToGrid({
        x: pointer.x,
        y: pointer.y
      });
      
      // Update the line one last time
      const updateInfo = updateLine(
        currentLineRef.current,
        startPointRef.current.x,
        startPointRef.current.y,
        snappedPoint.x,
        snappedPoint.y
      );
      
      if (updateInfo) {
        // Finalize the line
        finalizeLine(
          currentLineRef.current,
          distanceTooltipRef.current,
          updateInfo.distance
        );
        
        captureMessage("Straight line created", "straight-line-completed", {
          extra: { distance: updateInfo.distanceInMeters }
        });
      }
      
      // Reset state
      resetDrawingState();
      canvas.requestRenderAll();
    } catch (error) {
      captureError(error as Error, "straight-line-mouseup-error");
      logger.error("Error handling mouse up in straight line tool", error);
    }
  }, [
    fabricCanvasRef,
    isDrawing,
    tool,
    snapPointToGrid,
    updateLine,
    finalizeLine,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    resetDrawingState
  ]);
  
  // Cancel drawing (e.g., when pressing escape)
  const cancelDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing) return;
    
    try {
      // Remove the line being drawn
      removeLine(currentLineRef.current, distanceTooltipRef.current);
      
      // Reset state
      resetDrawingState();
      
      logger.info("Line drawing cancelled");
      captureMessage("Straight line drawing cancelled", "straight-line-cancelled");
    } catch (error) {
      captureError(error as Error, "straight-line-cancel-error");
      logger.error("Error cancelling straight line drawing", error);
    }
  }, [fabricCanvasRef, isDrawing, removeLine, currentLineRef, distanceTooltipRef, resetDrawingState]);
  
  // Clean up any existing event handlers
  const cleanupEventHandlers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove our specific event handlers
    canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
    canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
    
    logger.info("Straight line event handlers removed");
    captureMessage("Straight line tool event handlers removed", "straight-line-handlers-cleanup");
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  };
};
