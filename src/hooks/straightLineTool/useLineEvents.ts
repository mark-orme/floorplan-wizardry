
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { calculateDistance } from '@/utils/geometryUtils';
import { FabricEventTypes } from '@/types/fabric-events';
import logger from '@/utils/logger';

interface UseLineEventsParams {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  lineState: {
    isDrawing: boolean;
    setIsDrawing: (isDrawing: boolean) => void;
    startPointRef: React.MutableRefObject<any>;
    currentLineRef: React.MutableRefObject<Line | null>;
    distanceTooltipRef: React.MutableRefObject<Text | null>;
    resetDrawingState: () => void;
    setStartPoint: (point: Point) => void;
    setCurrentLine: (line: Line) => void;
    setDistanceTooltip: (tooltip: Text) => void;
  };
}

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
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip
  } = lineState;

  // Handle mouse down to start drawing a line
  const handleMouseDown = useCallback(
    (opts: any) => {
      if (tool !== DrawingMode.STRAIGHT_LINE) return;
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Get mouse position
      const pointer = canvas.getPointer(opts.e);
      const point = { x: pointer.x, y: pointer.y };
      
      // Start drawing
      setStartPoint(point);
      
      logger.info("Straight line drawing started", { 
        startPoint: point, 
        lineColor, 
        lineThickness 
      });
    },
    [tool, fabricCanvasRef, lineColor, lineThickness, setStartPoint]
  );

  // Handle mouse move to update the line while drawing
  const handleMouseMove = useCallback(
    (opts: any) => {
      if (tool !== DrawingMode.STRAIGHT_LINE || !isDrawing) return;
      
      const canvas = fabricCanvasRef.current;
      if (!canvas || !startPointRef.current) return;
      
      // Get current pointer position
      const pointer = canvas.getPointer(opts.e);
      
      // Create a new line or update existing one
      if (!currentLineRef.current) {
        const line = new Line(
          [
            startPointRef.current.x,
            startPointRef.current.y,
            pointer.x,
            pointer.y
          ],
          {
            stroke: lineColor,
            strokeWidth: lineThickness,
            selectable: true,
            evented: true,
            objectType: 'line'
          }
        );
        
        canvas.add(line);
        setCurrentLine(line);
        
        // Create distance tooltip
        const midX = (startPointRef.current.x + pointer.x) / 2;
        const midY = (startPointRef.current.y + pointer.y) / 2;
        
        const distance = calculateDistance(
          { x: startPointRef.current.x, y: startPointRef.current.y },
          { x: pointer.x, y: pointer.y }
        );
        
        const tooltip = new Text(`${distance.toFixed(2)}m`, {
          left: midX,
          top: midY,
          fontSize: 12,
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: 3,
          selectable: false,
          evented: false,
          objectType: 'measurement'
        });
        
        canvas.add(tooltip);
        setDistanceTooltip(tooltip);
      } else {
        // Update existing line
        currentLineRef.current.set({
          x2: pointer.x,
          y2: pointer.y
        });
        
        // Update distance tooltip
        if (distanceTooltipRef.current) {
          // Calculate new midpoint
          const midX = (startPointRef.current.x + pointer.x) / 2;
          const midY = (startPointRef.current.y + pointer.y) / 2;
          
          // Calculate new distance
          const distance = calculateDistance(
            { x: startPointRef.current.x, y: startPointRef.current.y },
            { x: pointer.x, y: pointer.y }
          );
          
          distanceTooltipRef.current.set({
            text: `${distance.toFixed(2)}m`,
            left: midX,
            top: midY
          });
        }
      }
      
      canvas.requestRenderAll();
    },
    [
      tool,
      isDrawing,
      fabricCanvasRef,
      lineColor,
      lineThickness,
      setCurrentLine,
      setDistanceTooltip
    ]
  );

  // Handle mouse up to complete the line
  const handleMouseUp = useCallback(
    (opts: any) => {
      if (tool !== DrawingMode.STRAIGHT_LINE || !isDrawing) return;
      
      const canvas = fabricCanvasRef.current;
      if (!canvas || !currentLineRef.current) return;
      
      // Complete drawing
      setIsDrawing(false);
      
      // Remove distance tooltip after a delay
      if (distanceTooltipRef.current) {
        setTimeout(() => {
          if (canvas && distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
            canvas.remove(distanceTooltipRef.current);
            canvas.requestRenderAll();
          }
        }, 2000);
      }
      
      // Save the current state for undo/redo
      saveCurrentState();
      
      // Reset refs for next drawing
      startPointRef.current = null;
      currentLineRef.current = null;
      distanceTooltipRef.current = null;
      
      logger.info("Straight line drawing completed");
    },
    [tool, isDrawing, fabricCanvasRef, setIsDrawing, saveCurrentState]
  );

  // Cancel drawing (e.g., on Escape key)
  const cancelDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove current line if exists
    if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
      canvas.remove(currentLineRef.current);
    }
    
    // Remove distance tooltip if exists
    if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // Reset drawing state
    resetDrawingState();
    
    canvas.requestRenderAll();
    logger.info("Straight line drawing canceled");
  }, [fabricCanvasRef, resetDrawingState]);

  // Clean up event handlers when component unmounts or tool changes
  const cleanupEventHandlers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove event handlers
    canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
    canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
    canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
    
    // Reset canvas cursor and selection
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'default';
    canvas.selection = true;
    
    // Reset object selectability
    canvas.getObjects().forEach(obj => {
      if ((obj as any).objectType !== 'grid') {
        obj.selectable = true;
      }
    });
    
    // Force render update
    canvas.requestRenderAll();
    
    logger.info("Straight line tool event handlers cleaned up");
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  };
};
