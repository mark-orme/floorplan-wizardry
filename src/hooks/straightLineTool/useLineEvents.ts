import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { calculateDistance } from '@/utils/geometryUtils';
import { FabricEventTypes } from '@/types/fabric-events';
import logger from '@/utils/logger';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';

interface UseLineEventsParams {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  lineState: {
    isDrawing: boolean;
    setIsDrawing: (isDrawing: boolean) => void;
    startPointRef: React.MutableRefObject<Point | null>;
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

  // Use snapping for grid alignment
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();

  // Handle mouse down to start drawing a line
  const handleMouseDown = useCallback(
    (opts: any) => {
      if (tool !== DrawingMode.STRAIGHT_LINE) return;
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Get mouse position and snap to grid
      const pointer = canvas.getPointer(opts.e);
      const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
      
      // Start drawing
      setStartPoint(snappedPoint);
      
      logger.info("Straight line drawing started", { 
        startPoint: snappedPoint, 
        lineColor, 
        lineThickness 
      });
    },
    [tool, fabricCanvasRef, lineColor, lineThickness, setStartPoint, snapPointToGrid]
  );

  // Handle mouse move to update the line while drawing
  const handleMouseMove = useCallback(
    (opts: any) => {
      if (tool !== DrawingMode.STRAIGHT_LINE || !isDrawing) return;
      
      const canvas = fabricCanvasRef.current;
      if (!canvas || !startPointRef.current) return;
      
      // Get current pointer position and snap to grid
      const pointer = canvas.getPointer(opts.e);
      const currentPoint = { x: pointer.x, y: pointer.y };
      
      // Apply constraint to create horizontal, vertical, or 45-degree lines
      const { start, end } = snapLineToGrid(startPointRef.current, currentPoint);
      
      // Create a new line or update existing one
      if (!currentLineRef.current) {
        const line = new Line(
          [
            start.x,
            start.y,
            end.x,
            end.y
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
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        
        const distance = calculateDistance(start, end);
        const distanceInMeters = (distance / 100).toFixed(2);
        
        const tooltip = new Text(`${distanceInMeters}m`, {
          left: midX,
          top: midY - 10,
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
          x2: end.x,
          y2: end.y
        });
        
        // Update distance tooltip
        if (distanceTooltipRef.current) {
          // Calculate new midpoint
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2 - 10;
          
          // Calculate new distance
          const distance = calculateDistance(start, end);
          const distanceInMeters = (distance / 100).toFixed(2);
          
          distanceTooltipRef.current.set({
            text: `${distanceInMeters}m`,
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
      setDistanceTooltip,
      snapLineToGrid
    ]
  );

  // Handle mouse up to complete the line
  const handleMouseUp = useCallback(
    (opts: any) => {
      if (tool !== DrawingMode.STRAIGHT_LINE || !isDrawing) return;
      
      const canvas = fabricCanvasRef.current;
      if (!canvas || !currentLineRef.current || !startPointRef.current) return;
      
      // Complete drawing
      setIsDrawing(false);
      
      // Get the final position and snap it
      const pointer = canvas.getPointer(opts.e);
      const currentPoint = { x: pointer.x, y: pointer.y };
      
      // Apply constraint for the final line
      const { end } = snapLineToGrid(startPointRef.current, currentPoint);
      
      // Update the line's final position
      currentLineRef.current.set({
        x2: end.x,
        y2: end.y
      });
      
      // Calculate final distance
      const distance = calculateDistance(startPointRef.current, end);
      
      // Only keep meaningful lines (longer than 5px)
      if (distance > 5) {
        // Save current state for undo
        saveCurrentState();
        
        // Make line selectable for later editing
        currentLineRef.current.set({
          selectable: true,
          evented: true
        });
        
        // Remove the tooltip after a delay
        if (distanceTooltipRef.current) {
          setTimeout(() => {
            if (canvas && distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
              canvas.remove(distanceTooltipRef.current);
              canvas.requestRenderAll();
            }
          }, 2000);
        }
      } else {
        // Line too short, remove it
        canvas.remove(currentLineRef.current);
        if (distanceTooltipRef.current) {
          canvas.remove(distanceTooltipRef.current);
        }
      }
      
      canvas.requestRenderAll();
      
      // Reset refs for next drawing
      resetDrawingState();
      
      logger.info("Straight line drawing completed");
    },
    [tool, isDrawing, fabricCanvasRef, setIsDrawing, saveCurrentState, resetDrawingState, snapLineToGrid]
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
