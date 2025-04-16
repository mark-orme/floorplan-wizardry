
/**
 * Hook for managing line drawing mouse events
 * @module hooks/straightLineTool/useLineEvents
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useLineState } from "./useLineState";

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
  const handleMouseDown = useCallback((e: any) => {
    if (!enabled) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    console.log("Straight line tool: mouse down", e.pointer);
    
    // Get point from event
    const point = snapPointToGrid({
      x: e.pointer.x,
      y: e.pointer.y
    });
    
    // Start drawing
    setIsDrawing(true);
    setStartPoint(point);
    startPointRef.current = point;
    
    // Create line
    const line = createLine(point.x, point.y, point.x, point.y);
    if (line) {
      canvas.add(line);
      setCurrentLine(line);
    
      // Create distance tooltip
      const tooltip = createDistanceTooltip(point.x, point.y, 0);
      if (tooltip) {
        canvas.add(tooltip);
        setDistanceTooltip(tooltip);
      }
    
      // Render
      canvas.renderAll();
    }
    
    // Prevent default browser behavior
    if (e.e) {
      e.e.preventDefault();
      e.e.stopPropagation();
    }
  }, [enabled, fabricCanvasRef, setIsDrawing, setStartPoint, createLine, setCurrentLine, createDistanceTooltip, setDistanceTooltip, snapPointToGrid, startPointRef]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: any) => {
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
    canvas.renderAll();
    
    // Prevent default browser behavior
    if (e.e) {
      e.e.preventDefault();
      e.e.stopPropagation();
    }
  }, [enabled, isDrawing, startPointRef, fabricCanvasRef, updateLineAndTooltip, snapPointToGrid]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: any) => {
    if (!enabled || !isDrawing || !startPointRef.current) return;
    
    console.log("Straight line tool: mouse up", e.pointer);
    
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
    } else {
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
    
    console.log("Straight line tool: setting up event listeners");
    
    // Register event handlers
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    // Clean up event handlers
    return () => {
      console.log("Straight line tool: cleaning up event listeners");
      if (canvas) {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      }
    };
  }, [enabled, fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
