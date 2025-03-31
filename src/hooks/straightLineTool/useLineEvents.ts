import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Geometry';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import { FabricEventTypes } from '@/types/fabric-events';

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
  
  const handleMouseDown = useCallback((opt: any) => {
    if (tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    const pointer = canvas.getPointer(opt.e);
    const point = { x: pointer.x, y: pointer.y };
    
    setStartPoint(point);
    
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      strokeLineCap: 'round',
      evented: true
    });
    
    canvas.add(line);
    setCurrentLine(line);
    
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
    
    canvas.requestRenderAll();
  }, [tool, fabricCanvasRef, lineColor, lineThickness, setStartPoint, setCurrentLine, setDistanceTooltip]);
  
  const handleMouseMove = useCallback((opt: any) => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current || !startPointRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(opt.e);
    const endPoint = { x: pointer.x, y: pointer.y };
    
    if (currentLineRef.current) {
      currentLineRef.current.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      const distance = calculateDistance(startPointRef.current, endPoint);
      const displayDistance = Math.round(distance);
      
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
  
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    saveCurrentState();
    
    resetDrawingState();
    
    canvas.requestRenderAll();
  }, [isDrawing, tool, fabricCanvasRef, saveCurrentState, resetDrawingState]);
  
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
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
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
    canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
    
    eventHandlersAttachedRef.current = false;
    
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
