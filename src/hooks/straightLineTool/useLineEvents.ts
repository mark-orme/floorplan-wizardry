
/**
 * Hook for managing line drawing mouse events
 * @module hooks/straightLineTool/useLineEvents
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { FabricEventTypes, TPointerEvent, TPointerEventInfo } from "@/types/fabric-events";
import { useLineState } from "./useLineState";
import logger from "@/utils/logger";

interface UseLineEventsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineState: ReturnType<typeof useLineState>;
  onComplete?: () => void;
  enabled: boolean;
}

export const useLineEvents = ({
  fabricCanvasRef,
  lineState,
  onComplete,
  enabled
}: UseLineEventsProps) => {
  const {
    isDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setIsDrawing,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    resetDrawingState,
    snapPointToGrid
  } = lineState;
  
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: TPointerEventInfo<TPointerEvent>) => {
    if (!enabled) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get point from event
    const point = snapPointToGrid({
      x: e.pointer.x,
      y: e.pointer.y
    });
    
    // Start drawing
    setIsDrawing(true);
    setStartPoint(point);
    
    // Create line
    const line = createLine(point.x, point.y, point.x, point.y);
    canvas.add(line);
    setCurrentLine(line);
    
    // Create distance tooltip
    const tooltip = createDistanceTooltip(point.x, point.y, 0);
    canvas.add(tooltip);
    setDistanceTooltip(tooltip);
    
    // Render
    canvas.requestRenderAll();
    
    // Prevent default browser behavior
    if (e.e) {
      e.e.preventDefault();
      e.e.stopPropagation();
    }
    
    logger.info("Started line drawing", { point });
  }, [enabled, fabricCanvasRef, setIsDrawing, setStartPoint, createLine, setCurrentLine, createDistanceTooltip, setDistanceTooltip, snapPointToGrid]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: TPointerEventInfo<TPointerEvent>) => {
    if (!enabled || !isDrawing || !startPointRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get point from event
    const point = snapPointToGrid({
      x: e.pointer.x,
      y: e.pointer.y
    });
    
    // Update line and tooltip
    updateLineAndTooltip(startPointRef.current, point);
    
    // Render
    canvas.requestRenderAll();
    
    // Prevent default browser behavior
    if (e.e) {
      e.e.preventDefault();
      e.e.stopPropagation();
    }
  }, [enabled, isDrawing, startPointRef, fabricCanvasRef, updateLineAndTooltip, snapPointToGrid]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: TPointerEventInfo<TPointerEvent>) => {
    if (!enabled || !isDrawing || !startPointRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get point from event
    const point = snapPointToGrid({
      x: e.pointer.x,
      y: e.pointer.y
    });
    
    // Update line and tooltip one last time
    updateLineAndTooltip(startPointRef.current, point);
    
    // Remove distance tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // If the line has no length (same start and end point), remove it
    if (
      startPointRef.current.x === point.x &&
      startPointRef.current.y === point.y &&
      currentLineRef.current
    ) {
      canvas.remove(currentLineRef.current);
      logger.info("Removed zero-length line");
    } else {
      logger.info("Completed line drawing", { 
        start: startPointRef.current, 
        end: point 
      });
      
      // Call complete callback
      if (onComplete) {
        onComplete();
      }
    }
    
    // Reset drawing state
    resetDrawingState();
    
    // Render
    canvas.requestRenderAll();
    
    // Prevent default browser behavior
    if (e.e) {
      e.e.preventDefault();
      e.e.stopPropagation();
    }
  }, [enabled, isDrawing, startPointRef, fabricCanvasRef, distanceTooltipRef, currentLineRef, updateLineAndTooltip, resetDrawingState, onComplete, snapPointToGrid]);
  
  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Register event handlers
    canvas.on(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    canvas.on(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
    canvas.on(FabricEventTypes.MOUSE_UP, handleMouseUp);
    
    // Clean up event handlers
    return () => {
      if (canvas) {
        canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
        canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
        canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
      }
    };
  }, [enabled, fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
