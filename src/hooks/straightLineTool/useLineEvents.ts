
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Geometry';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import { FabricEventTypes } from '@/types/fabric-events';
import logger from '@/utils/logger';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';

interface LineState {
  isDrawing: boolean;
  isToolInitialized: boolean;
  startPointRef: React.MutableRefObject<Point | null>;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<Text | null>;
  setStartPoint: (point: Point) => void;
  setCurrentLine: (line: Line) => void;
  setDistanceTooltip: (tooltip: Text) => void;
  initializeTool: () => void;
  resetDrawingState: () => void;
  setIsDrawing: (isDrawing: boolean) => void;
}

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
  
  const eventHandlersAttachedRef = useRef(false);
  
  // Use the grid snapping functionality with fabricCanvasRef
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid({
    fabricCanvasRef
  });
  
  const handleMouseDown = useCallback((opt: any) => {
    logger.info("Mouse down in straight line tool");
    if (tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) {
      logger.info(`Not handling mouse down: tool=${tool} or canvas not available`);
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    setIsDrawing(true);
    
    const pointer = canvas.getPointer(opt.e);
    // Apply grid snapping to starting point
    const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
    
    logger.info(`Starting line at point: x=${snappedPoint.x}, y=${snappedPoint.y}`);
    setStartPoint(snappedPoint);
    
    const line = new Line([snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      strokeLineCap: 'round',
      evented: true
    });
    
    canvas.add(line);
    setCurrentLine(line);
    
    const tooltip = new Text('0 px', {
      left: snappedPoint.x,
      top: snappedPoint.y,
      fontSize: 12,
      fill: '#333',
      backgroundColor: '#fff',
      selectable: false,
      evented: false
    });
    
    canvas.add(tooltip);
    setDistanceTooltip(tooltip);
    
    canvas.requestRenderAll();
  }, [tool, fabricCanvasRef, lineColor, lineThickness, setIsDrawing, setStartPoint, setCurrentLine, setDistanceTooltip, snapPointToGrid]);
  
  const handleMouseMove = useCallback((opt: any) => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current || !startPointRef.current) {
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(opt.e);
    
    // Apply grid snapping to end point
    const rawEndPoint = { x: pointer.x, y: pointer.y };
    const snappedEndPoint = snapPointToGrid(rawEndPoint);
    
    // Apply line straightening constraints for vertical/horizontal/diagonal lines
    const straightenedLine = snapLineToGrid(startPointRef.current, snappedEndPoint);
    
    if (currentLineRef.current) {
      currentLineRef.current.set({
        x2: straightenedLine.end.x,
        y2: straightenedLine.end.y
      });
      
      const distance = calculateDistance(startPointRef.current, straightenedLine.end);
      const displayDistance = Math.round(distance);
      
      if (distanceTooltipRef.current) {
        const midpoint = getMidpoint(startPointRef.current, straightenedLine.end);
        
        distanceTooltipRef.current.set({
          left: midpoint.x,
          top: midpoint.y - 15,
          text: `${displayDistance} px`
        });
      }
      
      canvas.requestRenderAll();
    }
  }, [isDrawing, tool, fabricCanvasRef, startPointRef, currentLineRef, distanceTooltipRef, snapPointToGrid, snapLineToGrid]);
  
  const handleMouseUp = useCallback(() => {
    logger.info("Mouse up in straight line tool", { isDrawing, tool });
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current || !startPointRef.current) {
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    // Only save if we have actually drawn a line
    if (currentLineRef.current) {
      const start = { x: currentLineRef.current.x1, y: currentLineRef.current.y1 };
      const end = { x: currentLineRef.current.x2, y: currentLineRef.current.y2 };
      
      // Only save if the line has some length
      const distance = calculateDistance(start, end);
      if (distance > 1) {
        // Save current state to undo history
        saveCurrentState();
        logger.info("Completed line drawing, state saved");
      } else {
        // Line too short, remove it
        if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
          canvas.remove(currentLineRef.current);
        }
        
        if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
          canvas.remove(distanceTooltipRef.current);
        }
      }
    }
    
    // Reset drawing state to prepare for next line
    resetDrawingState();
    
    canvas.requestRenderAll();
  }, [isDrawing, tool, fabricCanvasRef, startPointRef, saveCurrentState, resetDrawingState, currentLineRef, distanceTooltipRef]);
  
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    logger.info("Cancelling line drawing");
    
    if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
      canvas.remove(currentLineRef.current);
    }
    
    if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    resetDrawingState();
    
    canvas.requestRenderAll();
  }, [isDrawing, fabricCanvasRef, currentLineRef, distanceTooltipRef, resetDrawingState]);
  
  const cleanupEventHandlers = useCallback(() => {
    logger.info("Cleaning up straight line event handlers");
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Fix: Be explicit about removing the exact same function references
    canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
    canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
    
    eventHandlersAttachedRef.current = false;
    
    resetDrawingState();
    logger.info("Line event handlers removed");
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp, resetDrawingState]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  };
};
