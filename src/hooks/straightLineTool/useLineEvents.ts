
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Geometry';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import { FabricEventTypes } from '@/types/fabric-events';
import logger from '@/utils/logger';

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
  
  // Simple grid snapping function
  const snapToGrid = useCallback((point: Point, gridSize: number = 20): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, []);
  
  // Straighten lines if close to horizontal, vertical, or 45° diagonal
  const straightenLine = useCallback((start: Point, end: Point): Point => {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    
    // If nearly horizontal (Y difference is small)
    if (dy < dx * 0.2) {
      return { x: end.x, y: start.y };
    }
    
    // If nearly vertical (X difference is small)
    if (dx < dy * 0.2) {
      return { x: start.x, y: end.y };
    }
    
    // If close to 45° diagonal
    if (Math.abs(dx - dy) < Math.min(dx, dy) * 0.3) {
      // Make it exactly 45°
      const distance = Math.min(dx, dy);
      const signX = end.x > start.x ? 1 : -1;
      const signY = end.y > start.y ? 1 : -1;
      return {
        x: start.x + distance * signX,
        y: start.y + distance * signY
      };
    }
    
    return end;
  }, []);
  
  const handleMouseDown = useCallback((opt: any) => {
    console.log("Mouse down in straight line tool");
    
    if (tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) {
      console.log(`Not handling mouse down: tool=${tool} or canvas not available`);
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    setIsDrawing(true);
    
    const pointer = canvas.getPointer(opt.e);
    // Apply grid snapping to starting point
    const snappedPoint = snapToGrid({ x: pointer.x, y: pointer.y });
    
    console.log(`Starting line at point: x=${snappedPoint.x}, y=${snappedPoint.y}`);
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
  }, [tool, fabricCanvasRef, lineColor, lineThickness, setIsDrawing, setStartPoint, setCurrentLine, setDistanceTooltip, snapToGrid]);
  
  const handleMouseMove = useCallback((opt: any) => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current || !startPointRef.current) {
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(opt.e);
    
    // Apply grid snapping to end point
    const rawEndPoint = { x: pointer.x, y: pointer.y };
    const snappedEndPoint = snapToGrid(rawEndPoint);
    
    // Apply line straightening constraints for vertical/horizontal/diagonal lines
    const straightenedEnd = straightenLine(startPointRef.current, snappedEndPoint);
    
    if (currentLineRef.current) {
      currentLineRef.current.set({
        x2: straightenedEnd.x,
        y2: straightenedEnd.y
      });
      
      const distance = calculateDistance(startPointRef.current, straightenedEnd);
      const displayDistance = Math.round(distance);
      
      if (distanceTooltipRef.current) {
        const midpoint = getMidpoint(startPointRef.current, straightenedEnd);
        
        distanceTooltipRef.current.set({
          left: midpoint.x,
          top: midpoint.y - 15,
          text: `${displayDistance} px`
        });
      }
      
      canvas.requestRenderAll();
    }
  }, [isDrawing, tool, fabricCanvasRef, startPointRef, currentLineRef, distanceTooltipRef, snapToGrid, straightenLine]);
  
  const handleMouseUp = useCallback(() => {
    console.log("Mouse up in straight line tool", { isDrawing, tool });
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
        console.log("Completed line drawing, state saved");
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
    
    console.log("Cancelling line drawing");
    
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
    console.log("Cleaning up straight line event handlers");
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Fix: Be explicit about removing the exact same function references
    canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
    canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
    
    eventHandlersAttachedRef.current = false;
    
    resetDrawingState();
    console.log("Line event handlers removed");
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp, resetDrawingState]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  };
};
