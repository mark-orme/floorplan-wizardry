
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import { FabricEventTypes } from '@/types/fabric-events';

// Interface for the line state parameter
interface LineState {
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  isToolInitialized: boolean;
  startPointRef: React.MutableRefObject<Point | null>;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<Text | null>;
  setStartPoint: (point: Point) => void;
  setCurrentLine: (line: Line) => void;
  setDistanceTooltip: (tooltip: Text) => void;
  initializeTool: () => void;
  resetDrawingState: () => void;
}

/**
 * Hook for handling line drawing events
 */
export const useLineEvents = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  tool: DrawingMode,
  lineColor: string,
  lineThickness: number,
  saveCurrentState: () => void,
  lineState: LineState
) => {
  const { 
    isDrawing, 
    setIsDrawing, 
    startPointRef, 
    currentLineRef, 
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    resetDrawingState
  } = lineState;
  
  // Track if event handlers have been attached
  const eventHandlersAttachedRef = useRef(false);
  
  /**
   * Handle mouse down event - start drawing a line
   */
  const handleMouseDown = useCallback((opt: any) => {
    if (tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Get pointer position
    const pointer = canvas.getPointer(opt.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Set start point
    setStartPoint(point);
    
    // Create initial line
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      strokeLineCap: 'round',
      evented: true
    });
    
    // Add line to canvas
    canvas.add(line);
    setCurrentLine(line);
    
    // Create tooltip for distance
    const tooltip = new Text('0 px', {
      left: point.x,
      top: point.y,
      fontSize: 12,
      fill: '#333',
      backgroundColor: '#fff',
      selectable: false,
      evented: false
    });
    
    canvas.add(tooltip);
    setDistanceTooltip(tooltip);
    
    // Force render
    canvas.requestRenderAll();
  }, [tool, fabricCanvasRef, lineColor, lineThickness, setStartPoint, setCurrentLine, setDistanceTooltip]);
  
  /**
   * Handle mouse move event - update line while drawing
   */
  const handleMouseMove = useCallback((opt: any) => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current || !startPointRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(opt.e);
    const endPoint = { x: pointer.x, y: pointer.y };
    
    // Update line coordinates
    if (currentLineRef.current) {
      currentLineRef.current.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      // Calculate distance
      const distance = calculateDistance(startPointRef.current, endPoint);
      const displayDistance = Math.round(distance);
      
      // Update tooltip
      if (distanceTooltipRef.current) {
        const midpoint = getMidpoint(startPointRef.current, endPoint);
        
        distanceTooltipRef.current.set({
          left: midpoint.x,
          top: midpoint.y - 15,
          text: `${displayDistance} px`
        });
      }
      
      canvas.requestRenderAll();
    }
  }, [isDrawing, tool, fabricCanvasRef, startPointRef, currentLineRef, distanceTooltipRef]);
  
  /**
   * Handle mouse up event - finish drawing a line
   */
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Save current state to history
    saveCurrentState();
    
    // Reset drawing state
    resetDrawingState();
    
    // Force render
    canvas.requestRenderAll();
  }, [isDrawing, tool, fabricCanvasRef, saveCurrentState, resetDrawingState]);
  
  /**
   * Cancel drawing operation
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Remove current line and tooltip
    if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
      canvas.remove(currentLineRef.current);
    }
    
    if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // Reset drawing state
    resetDrawingState();
    
    // Force render
    canvas.requestRenderAll();
  }, [isDrawing, fabricCanvasRef, currentLineRef, distanceTooltipRef, resetDrawingState]);
  
  /**
   * Cleanup event handlers
   */
  const cleanupEventHandlers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove event handlers
    canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
    canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
    
    // Reset event handler tracking
    eventHandlersAttachedRef.current = false;
    
    // Reset line state
    resetDrawingState();
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp, resetDrawingState]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  };
};
