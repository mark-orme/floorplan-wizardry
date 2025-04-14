
/**
 * Enhanced straight line drawing tool with touch and Apple Pencil support
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { useLineState } from './useLineState';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';

export interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  saveCurrentState?: () => void;
}

/**
 * Hook for straight line drawing with enhanced touch and stylus support
 */
export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {}
}: UseStraightLineToolProps) => {
  // Get line state management
  const {
    isDrawing,
    isToolInitialized,
    setIsDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    inputMethod,
    isPencilMode,
    resetDrawingState,
    initializeTool,
    snapPointToGrid,
    snapLineToGrid,
    snapEnabled,
    toggleSnap
  } = useLineState({
    fabricCanvasRef,
    lineThickness,
    lineColor
  });
  
  // Error reporting
  const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();
  
  // Track initialization status
  const [isActive, setIsActive] = useState(false);
  const eventHandlersAttachedRef = useRef(false);
  
  // Initialize the tool when it becomes active
  useEffect(() => {
    if (tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.LINE) {
      if (!isToolInitialized) {
        const success = initializeTool();
        setIsActive(success);
        
        if (success) {
          toast.success("Line tool ready! Click and drag to draw a line.", {
            id: "line-tool-ready",
            duration: 2000
          });
        }
      } else {
        setIsActive(true);
      }
      
      // Set up Fabric.js event handlers
      setupEventHandlers();
    } else {
      setIsActive(false);
      // Clean up if switching away from this tool
      cancelDrawing();
      cleanupEventHandlers();
    }
    
    // Clean up on unmount
    return () => {
      cleanupEventHandlers();
    };
  }, [tool, isToolInitialized, initializeTool]);
  
  /**
   * Set up Fabric.js event handlers
   */
  const setupEventHandlers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || eventHandlersAttachedRef.current) return;
    
    // Set canvas properties for drawing
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
    
    // Disable selection for all objects (except those we've just drawn)
    canvas.getObjects().forEach(obj => {
      if ((obj as any).objectType !== 'straight-line') {
        obj.selectable = false;
      }
    });
    
    // Attach event handlers through Fabric.js
    canvas.on('mouse:down', handleCanvasMouseDown);
    canvas.on('mouse:move', handleCanvasMouseMove);
    canvas.on('mouse:up', handleCanvasMouseUp);
    
    eventHandlersAttachedRef.current = true;
    
    logDrawingEvent('Line drawing event handlers attached', 'setup-event-handlers', {
      tool: DrawingMode.STRAIGHT_LINE
    });
  }, [fabricCanvasRef]);
  
  /**
   * Clean up Fabric.js event handlers
   */
  const cleanupEventHandlers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !eventHandlersAttachedRef.current) return;
    
    // Remove event handlers
    canvas.off('mouse:down', handleCanvasMouseDown);
    canvas.off('mouse:move', handleCanvasMouseMove);
    canvas.off('mouse:up', handleCanvasMouseUp);
    
    // Reset canvas properties
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'default';
    
    eventHandlersAttachedRef.current = false;
    
    logDrawingEvent('Line drawing event handlers removed', 'cleanup-event-handlers', {
      tool: DrawingMode.STRAIGHT_LINE
    });
  }, [fabricCanvasRef]);
  
  /**
   * Handle canvas mouse down event
   */
  const handleCanvasMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current || tool !== DrawingMode.STRAIGHT_LINE) return;
    
    try {
      const pointer = fabricCanvasRef.current.getPointer(e.e);
      handlePointerDown({ x: pointer.x, y: pointer.y });
    } catch (error) {
      reportDrawingError(error, 'canvas-mouse-down', {
        tool: DrawingMode.STRAIGHT_LINE
      });
    }
  }, [tool, fabricCanvasRef, handlePointerDown]);
  
  /**
   * Handle canvas mouse move event
   */
  const handleCanvasMouseMove = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !isDrawing || tool !== DrawingMode.STRAIGHT_LINE) return;
    
    try {
      const pointer = fabricCanvasRef.current.getPointer(e.e);
      handlePointerMove({ x: pointer.x, y: pointer.y });
    } catch (error) {
      reportDrawingError(error, 'canvas-mouse-move', {
        tool: DrawingMode.STRAIGHT_LINE
      });
    }
  }, [tool, fabricCanvasRef, isDrawing, handlePointerMove]);
  
  /**
   * Handle canvas mouse up event
   */
  const handleCanvasMouseUp = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !isDrawing || tool !== DrawingMode.STRAIGHT_LINE) return;
    
    try {
      const pointer = fabricCanvasRef.current.getPointer(e.e);
      handlePointerUp({ x: pointer.x, y: pointer.y });
    } catch (error) {
      reportDrawingError(error, 'canvas-mouse-up', {
        tool: DrawingMode.STRAIGHT_LINE
      });
    }
  }, [tool, fabricCanvasRef, isDrawing, handlePointerUp]);
  
  /**
   * Handle mouse down or touch start to begin drawing
   */
  const handlePointerDown = useCallback((point: Point) => {
    if (!fabricCanvasRef.current) return;
    
    // Only proceed if the straight line tool is active
    if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Save current state before starting new drawing (for undo)
      saveCurrentState();
      
      // Snap to grid if enabled
      const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
      
      // Set as drawing
      setIsDrawing(true);
      
      // Set the start point
      setStartPoint(snappedPoint);
      
      // Create initial line (point to same point)
      const line = new Line([
        snappedPoint.x, snappedPoint.y, 
        snappedPoint.x, snappedPoint.y
      ], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        evented: false,
        objectType: 'straight-line-drawing'
      });
      
      // Update line reference
      setCurrentLine(line);
      
      // Add line to canvas
      canvas.add(line);
      
      // Create initial tooltip
      const tooltip = new Text('0 m', {
        left: snappedPoint.x,
        top: snappedPoint.y - 15,
        fontSize: 14,
        fill: lineColor,
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'bottom'
      });
      
      setDistanceTooltip(tooltip);
      canvas.add(tooltip);
      
      // Force render
      canvas.requestRenderAll();
      
      logDrawingEvent('Started line drawing', 'line-drawing-start', {
        tool: DrawingMode.STRAIGHT_LINE,
        interaction: { type: inputMethod }
      });
    } catch (error) {
      reportDrawingError(error, 'start-line-drawing', {
        tool: DrawingMode.STRAIGHT_LINE,
        interaction: { type: inputMethod }
      });
      resetDrawingState();
    }
  }, [
    fabricCanvasRef, 
    tool, 
    saveCurrentState, 
    setIsDrawing, 
    setStartPoint, 
    setCurrentLine, 
    setDistanceTooltip,
    lineColor, 
    lineThickness, 
    logDrawingEvent, 
    reportDrawingError, 
    resetDrawingState,
    inputMethod,
    snapEnabled,
    snapPointToGrid
  ]);
  
  /**
   * Handle mouse move or touch move to update the line
   */
  const handlePointerMove = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !startPointRef.current) return;
    
    // Only proceed if the straight line tool is active
    if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Snap points if enabled
      const snappedStart = startPointRef.current;
      const snappedEnd = snapEnabled ? snapPointToGrid(point) : point;
      
      // Check if shift is pressed for angle constraints
      const isShiftPressed = window.event && (window.event as KeyboardEvent).shiftKey;
      
      if (isShiftPressed) {
        // Use snapLineToGrid which handles angle snapping with shift key
        const snappedPoints = snapLineToGrid(snappedStart, snappedEnd);
        
        // Update end point only - keep original start point
        if (currentLineRef.current) {
          currentLineRef.current.set({
            x2: snappedPoints.end.x,
            y2: snappedPoints.end.y
          });
          
          // Calculate distance
          const dx = snappedPoints.end.x - snappedStart.x;
          const dy = snappedPoints.end.y - snappedStart.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Convert to meters
          const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
          
          // Position tooltip at midpoint above line
          const midX = (snappedStart.x + snappedPoints.end.x) / 2;
          const midY = (snappedStart.y + snappedPoints.end.y) / 2 - 15;
          
          // Update tooltip
          if (distanceTooltipRef.current) {
            distanceTooltipRef.current.set({
              text: `${distanceInMeters} m`,
              left: midX,
              top: midY
            });
          }
          
          // Force render
          canvas.requestRenderAll();
        }
      } else {
        // Just update the end point directly
        if (currentLineRef.current) {
          currentLineRef.current.set({
            x2: snappedEnd.x,
            y2: snappedEnd.y
          });
          
          // Calculate distance
          const dx = snappedEnd.x - snappedStart.x;
          const dy = snappedEnd.y - snappedStart.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Convert to meters
          const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
          
          // Position tooltip at midpoint above line
          const midX = (snappedStart.x + snappedEnd.x) / 2;
          const midY = (snappedStart.y + snappedEnd.y) / 2 - 15;
          
          // Update tooltip
          if (distanceTooltipRef.current) {
            distanceTooltipRef.current.set({
              text: `${distanceInMeters} m`,
              left: midX,
              top: midY
            });
          }
          
          // Force render
          canvas.requestRenderAll();
        }
      }
    } catch (error) {
      reportDrawingError(error, 'update-line-drawing', {
        tool: DrawingMode.STRAIGHT_LINE,
        interaction: { type: inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    tool, 
    reportDrawingError, 
    startPointRef, 
    currentLineRef, 
    distanceTooltipRef,
    inputMethod,
    snapEnabled,
    snapPointToGrid,
    snapLineToGrid
  ]);
  
  /**
   * Handle mouse up or touch end to complete the line
   */
  const handlePointerUp = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !startPointRef.current) return;
    
    // Only proceed if the straight line tool is active
    if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Snap points if enabled
      const snappedStart = startPointRef.current;
      const snappedEnd = snapEnabled ? snapPointToGrid(point) : point;
      
      // Calculate distance
      const dx = snappedEnd.x - snappedStart.x;
      const dy = snappedEnd.y - snappedStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only keep the line if it has a meaningful length
      if (distance > 5) {
        // Convert to meters
        const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
        
        // Make final line selectable
        if (currentLineRef.current) {
          currentLineRef.current.set({
            x2: snappedEnd.x,
            y2: snappedEnd.y,
            selectable: true,
            evented: true,
            objectType: 'straight-line',
            measurement: `${distanceInMeters} m`,
            inputMethod,
            pencilUsed: isPencilMode
          });
        }
        
        // Make tooltip permanent (but still not selectable)
        if (distanceTooltipRef.current) {
          distanceTooltipRef.current.set({
            text: `${distanceInMeters} m`,
            selectable: false,
            evented: true,
            objectType: 'measurement'
          });
        }
        
        logDrawingEvent('Completed line drawing', 'line-drawing-complete', {
          tool: DrawingMode.STRAIGHT_LINE,
          drawingState: {
            isDrawing: true,
            pointCount: 2,
            sessionDuration: 0
          },
          interaction: { type: inputMethod }
        });
        
        // Trigger completion indicator
        toast.success(`Line drawn: ${distanceInMeters} m`);
      } else {
        // Line too short, remove it
        if (currentLineRef.current) {
          canvas.remove(currentLineRef.current);
        }
        
        if (distanceTooltipRef.current) {
          canvas.remove(distanceTooltipRef.current);
        }
        
        logDrawingEvent('Cancelled line (too short)', 'line-drawing-discard', {
          tool: DrawingMode.STRAIGHT_LINE,
          interaction: { type: inputMethod }
        });
      }
      
      // Reset drawing state
      resetDrawingState();
      
      // Force render
      canvas.requestRenderAll();
    } catch (error) {
      reportDrawingError(error, 'complete-line-drawing', {
        tool: DrawingMode.STRAIGHT_LINE,
        interaction: { type: inputMethod }
      });
      resetDrawingState();
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    tool, 
    resetDrawingState, 
    logDrawingEvent, 
    reportDrawingError, 
    startPointRef, 
    currentLineRef, 
    distanceTooltipRef,
    inputMethod, 
    isPencilMode,
    snapEnabled,
    snapPointToGrid
  ]);
  
  /**
   * Cancel drawing (e.g. on escape key)
   */
  const cancelDrawing = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Remove current line if it exists
      if (currentLineRef.current) {
        canvas.remove(currentLineRef.current);
      }
      
      // Remove tooltip if it exists
      if (distanceTooltipRef.current) {
        canvas.remove(distanceTooltipRef.current);
      }
      
      // Reset drawing state
      resetDrawingState();
      
      // Force render
      canvas.requestRenderAll();
      
      logDrawingEvent('Cancelled line drawing', 'line-drawing-cancel', {
        tool: DrawingMode.STRAIGHT_LINE,
        interaction: { type: inputMethod }
      });
    } catch (error) {
      reportDrawingError(error, 'cancel-line-drawing', {
        tool: DrawingMode.STRAIGHT_LINE,
        interaction: { type: inputMethod }
      });
      resetDrawingState();
    }
  }, [
    fabricCanvasRef, 
    resetDrawingState, 
    currentLineRef, 
    distanceTooltipRef, 
    logDrawingEvent, 
    reportDrawingError,
    inputMethod
  ]);
  
  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    toggleSnap();
  }, [toggleSnap]);
  
  // Set up keyboard event listeners for Escape key to cancel drawing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawing) {
        cancelDrawing();
      }
      if (e.key === 'g') {
        toggleGridSnapping();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawing, cancelDrawing, toggleGridSnapping]);
  
  return {
    isActive,
    isDrawing,
    inputMethod,
    isPencilMode,
    snapEnabled,
    isToolInitialized,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping
  };
};
