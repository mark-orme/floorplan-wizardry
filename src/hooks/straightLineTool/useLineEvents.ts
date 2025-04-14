
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Geometry';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import { FabricEventNames as FabricEventTypes } from '@/types/fabric-events';
import logger from '@/utils/logger';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { captureError, captureMessage } from '@/utils/sentry';

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
  
  // Track operational metrics
  const metricsRef = useRef({
    linesStarted: 0,
    linesCompleted: 0,
    linesCancelled: 0,
    lastError: null as Error | null,
    lastEventTimestamp: Date.now()
  });
  
  // Send diagnostic metrics to Sentry periodically
  useEffect(() => {
    if (tool !== DrawingMode.STRAIGHT_LINE) return;
    
    const intervalId = setInterval(() => {
      if (metricsRef.current.linesStarted > 0) {
        captureMessage("Straight line metrics", "line-tool-metrics", {
          extra: { 
            ...metricsRef.current,
            timeSinceLastEvent: Date.now() - metricsRef.current.lastEventTimestamp
          }
        });
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [tool]);
  
  const handleMouseDown = useCallback((opt: any) => {
    logger.info("Mouse down in straight line tool");
    
    try {
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
      
      // Track in metrics
      metricsRef.current.linesStarted++;
      metricsRef.current.lastEventTimestamp = Date.now();
      
      try {
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
        
        // Track successful line creation
        captureMessage("Line creation started", "line-creation-start", {
          tags: { component: "useLineEvents" },
          extra: { 
            startPoint: snappedPoint,
            lineColor, 
            lineThickness,
            toolState: tool
          }
        });
      } catch (error) {
        // Capture specific error about line creation
        captureError(error as Error, "line-creation-error", {
          tags: { 
            component: "useLineEvents", 
            phase: "object-creation",
            critical: "true"
          },
          extra: { 
            startPoint: snappedPoint,
            canvasState: {
              width: canvas.width,
              height: canvas.height,
              objectCount: canvas.getObjects().length
            }
          }
        });
        
        // Store in metrics
        metricsRef.current.lastError = error as Error;
        
        logger.error("Failed to create line objects", error);
      }
    } catch (error) {
      // Catch any unexpected errors in the handler itself
      captureError(error as Error, "mouse-down-handler-error", {
        tags: { component: "useLineEvents" },
        extra: { 
          hasCanvas: !!fabricCanvasRef.current,
          tool
        }
      });
      
      logger.error("Unexpected error in mouse down handler", error);
    }
  }, [tool, fabricCanvasRef, lineColor, lineThickness, setIsDrawing, setStartPoint, setCurrentLine, setDistanceTooltip, snapPointToGrid]);
  
  const handleMouseMove = useCallback((opt: any) => {
    try {
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
        
        // Update metrics timestamp
        metricsRef.current.lastEventTimestamp = Date.now();
      } else {
        // If currentLineRef is null during drawing, this is an error condition
        captureError(
          new Error("Current line reference is null during mouse move"),
          "line-reference-null-error",
          {
            tags: { 
              component: "useLineEvents", 
              phase: "mouse-move",
              critical: "true"
            },
            extra: { 
              isDrawing,
              hasStartPoint: !!startPointRef.current,
              hasDistanceTooltip: !!distanceTooltipRef.current,
              snappedEndPoint,
              straightenedEnd: straightenedLine.end
            }
          }
        );
      }
    } catch (error) {
      captureError(error as Error, "mouse-move-handler-error", {
        tags: { component: "useLineEvents" },
        extra: { 
          isDrawing,
          hasStartPoint: !!startPointRef.current,
          hasCurrentLine: !!currentLineRef.current
        }
      });
      
      logger.error("Error during mouse move in line tool", error);
    }
  }, [isDrawing, tool, fabricCanvasRef, startPointRef, currentLineRef, distanceTooltipRef, snapPointToGrid, snapLineToGrid]);
  
  const handleMouseUp = useCallback(() => {
    logger.info("Mouse up in straight line tool", { isDrawing, tool });
    
    try {
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
          
          // Track in metrics
          metricsRef.current.linesCompleted++;
          metricsRef.current.lastEventTimestamp = Date.now();
          
          captureMessage("Line drawing completed", "line-creation-complete", {
            tags: { component: "useLineEvents" },
            extra: { 
              start,
              end,
              distance,
              lineColor,
              lineThickness
            }
          });
        } else {
          // Line too short, remove it
          if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
            canvas.remove(currentLineRef.current);
          }
          
          if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
            canvas.remove(distanceTooltipRef.current);
          }
          
          captureMessage("Line drawing discarded (too short)", "line-creation-discarded", {
            tags: { component: "useLineEvents" },
            extra: { distance }
          });
        }
      } else {
        // This shouldn't happen but capture in case it does
        captureError(
          new Error("Current line reference is null during mouse up"),
          "line-reference-null-on-complete",
          {
            tags: { 
              component: "useLineEvents", 
              phase: "mouse-up"
            },
            extra: { 
              isDrawing,
              hasStartPoint: !!startPointRef.current,
              hasDistanceTooltip: !!distanceTooltipRef.current
            }
          }
        );
      }
      
      // Reset drawing state to prepare for next line
      resetDrawingState();
      
      canvas.requestRenderAll();
    } catch (error) {
      captureError(error as Error, "mouse-up-handler-error", {
        tags: { component: "useLineEvents" },
        extra: { 
          isDrawing,
          tool,
          hasCanvas: !!fabricCanvasRef.current,
          hasStartPoint: !!startPointRef.current,
          hasCurrentLine: !!currentLineRef.current
        }
      });
      
      logger.error("Error during mouse up in line tool", error);
      
      // Try to reset state even if an error occurred
      try {
        resetDrawingState();
      } catch (resetError) {
        logger.error("Error resetting drawing state after error", resetError);
      }
    }
  }, [isDrawing, tool, fabricCanvasRef, startPointRef, saveCurrentState, resetDrawingState, currentLineRef, distanceTooltipRef, lineColor, lineThickness]);
  
  const cancelDrawing = useCallback(() => {
    try {
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
      
      // Track in metrics
      metricsRef.current.linesCancelled++;
      metricsRef.current.lastEventTimestamp = Date.now();
      
      captureMessage("Line drawing cancelled", "line-creation-cancelled", {
        tags: { component: "useLineEvents" }
      });
    } catch (error) {
      captureError(error as Error, "cancel-drawing-error", {
        tags: { component: "useLineEvents" }
      });
      
      logger.error("Error cancelling line drawing", error);
      
      // Try to reset anyway
      resetDrawingState();
    }
  }, [isDrawing, fabricCanvasRef, currentLineRef, distanceTooltipRef, resetDrawingState]);
  
  const cleanupEventHandlers = useCallback(() => {
    logger.info("Cleaning up straight line event handlers");
    
    try {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Fix: Be explicit about removing the exact same function references
      canvas.off(FabricEventTypes.MOUSE_DOWN, handleMouseDown);
      canvas.off(FabricEventTypes.MOUSE_MOVE, handleMouseMove);
      canvas.off(FabricEventTypes.MOUSE_UP, handleMouseUp);
      
      eventHandlersAttachedRef.current = false;
      
      resetDrawingState();
      logger.info("Line event handlers removed");
      
      captureMessage("Line event handlers cleanup complete", "event-handlers-cleanup", {
        tags: { component: "useLineEvents" },
        extra: {
          eventHandlersAttached: eventHandlersAttachedRef.current,
          metrics: { ...metricsRef.current }
        }
      });
    } catch (error) {
      captureError(error as Error, "cleanup-event-handlers-error", {
        tags: { component: "useLineEvents" }
      });
      
      logger.error("Error during cleanup of event handlers", error);
    }
  }, [fabricCanvasRef, handleMouseDown, handleMouseMove, handleMouseUp, resetDrawingState]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  };
};
