
/**
 * Hook for drawing straight lines on canvas
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineState } from './useLineState';
import { captureError } from '@/utils/sentry';
import { useDrawingToolManager } from '../drawing/useDrawingToolManager';
import { Point, createPoint } from '@/types/core/Point';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import logger from '@/utils/logger';
import { FabricEventNames, TPointerEventInfo, TPointerEvent } from '@/types/fabric-events';
import { useSnapToGrid } from '../useSnapToGrid';

/**
 * Props for useStraightLineTool hook
 */
interface UseStraightLineToolProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingMode;
  /** Line color for drawing */
  lineColor: string;
  /** Line thickness for drawing */
  lineThickness: number;
  /** Function to save current canvas state */
  saveCurrentState?: () => void;
}

/**
 * Return type for useStraightLineTool hook
 */
interface UseStraightLineToolResult {
  /** Whether the line tool is active */
  isActive: boolean;
  /** Whether the line tool is initialized */
  isToolInitialized: boolean;
  /** Current line being drawn */
  currentLine: Line | null;
  /** Whether currently drawing a line */
  isDrawing: boolean;
  /** Cancel the current drawing */
  cancelDrawing: () => void;
}

/**
 * Hook for drawing straight lines on canvas
 * 
 * @param {UseStraightLineToolProps} props - Hook properties
 * @returns {UseStraightLineToolResult} Straight line tool state and handlers
 */
export const useStraightLineTool = (
  props: UseStraightLineToolProps
): UseStraightLineToolResult => {
  const {
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState
  } = props;

  // Get snap to grid functionality
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid({ fabricCanvasRef });

  // Get line state from useLineState hook
  const {
    isDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    initializeTool,
    resetDrawingState
  } = useLineState();

  // Initialize the tool when it becomes active
  useEffect(() => {
    if ((tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.LINE) && !isToolInitialized) {
      console.log("Initializing straight line tool");
      initializeTool();
    }
  }, [tool, isToolInitialized, initializeTool]);

  // Get centralized drawing tool manager
  const {
    drawingState,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing: cancelToolDrawing,
    mouseHandlers
  } = useDrawingToolManager({
    fabricCanvasRef,
    tool,
    saveCurrentState,
    lineThickness,
    lineColor
  });

  // Layer our line-specific logic on top of the drawing manager
  useEffect(() => {
    // Only run for straight line tool
    if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // If drawing just started, create a line
    if (drawingState.isDrawing && drawingState.points.length === 1 && !currentLineRef.current) {
      const startPoint = drawingState.startPoint;
      if (!startPoint) return;
      
      try {
        // Snap start point to grid
        const snappedStartPoint = snapPointToGrid(startPoint);
        
        // Create initial line
        const line = new Line([
          snappedStartPoint.x, 
          snappedStartPoint.y, 
          snappedStartPoint.x, 
          snappedStartPoint.y
        ], {
          stroke: lineColor,
          strokeWidth: lineThickness,
          selectable: false,
          evented: false
        });
        
        // Create distance tooltip
        const tooltip = new Text('0 px', {
          left: snappedStartPoint.x,
          top: snappedStartPoint.y,
          fontSize: 12,
          fill: lineColor,
          selectable: false,
          evented: false
        });
        
        // Add to canvas
        canvas.add(line, tooltip);
        
        // Update refs
        setStartPoint(snappedStartPoint);
        setCurrentLine(line);
        setDistanceTooltip(tooltip);
        
        logger.info('Created initial straight line', { 
          startPoint: snappedStartPoint,
          lineColor,
          lineThickness
        });
      } catch (error) {
        captureError(error as Error, 'create-straight-line-error');
        logger.error('Failed to create straight line', { error });
      }
    }
    
    // If drawing is in progress, update the line
    if (drawingState.isDrawing && drawingState.points.length > 1) {
      const line = currentLineRef.current;
      const tooltip = distanceTooltipRef.current;
      const startPoint = startPointRef.current;
      const currentPoint = drawingState.currentPoint;
      
      if (!line || !tooltip || !startPoint || !currentPoint) return;
      
      try {
        // Use snapLineToGrid to straighten the line
        const { start, end } = snapLineToGrid(startPoint, currentPoint);
        
        // Update line endpoints
        line.set({
          x2: end.x,
          y2: end.y
        });
        
        // Calculate distance and update tooltip
        const distance = calculateDistance(start, end);
        const distanceInMeters = (distance / 100).toFixed(2); // Convert pixels to meters (100px = 1m)
        
        tooltip.set({
          text: `${distanceInMeters}m`,
          left: getMidpoint(start, end).x,
          top: getMidpoint(start, end).y - 15
        });
        
        // Render the updates
        canvas.renderAll();
      } catch (error) {
        captureError(error as Error, 'update-straight-line-error');
        logger.error('Failed to update straight line', { error });
      }
    }
    
    // If drawing just ended, finalize the line
    if (!drawingState.isDrawing && drawingState.points.length > 1 && currentLineRef.current) {
      const line = currentLineRef.current;
      const tooltip = distanceTooltipRef.current;
      
      try {
        // Make the line selectable
        line.set({
          selectable: true,
          evented: true,
          objectType: 'wall' // Mark as wall for future identification
        });
        
        // Remove the tooltip
        if (tooltip && canvas.contains(tooltip)) {
          canvas.remove(tooltip);
        }
        
        // Render the updates
        canvas.renderAll();
        
        // Reset the line state for the next line
        resetDrawingState();
        
        logger.info('Finalized straight line');
      } catch (error) {
        captureError(error as Error, 'finalize-straight-line-error');
        logger.error('Failed to finalize straight line', { error });
      }
    }
  }, [
    tool, 
    drawingState,
    fabricCanvasRef,
    lineColor,
    lineThickness,
    currentLineRef,
    distanceTooltipRef,
    startPointRef,
    setCurrentLine,
    setDistanceTooltip,
    setStartPoint,
    resetDrawingState,
    snapPointToGrid,
    snapLineToGrid
  ]);

  // Override drawing behaviors with our specific implementations
  const handleStartDrawing = useCallback((point: Point): void => {
    setIsDrawing(true);
    startDrawing(point);
  }, [setIsDrawing, startDrawing]);

  const handleEndDrawing = useCallback((): void => {
    setIsDrawing(false);
    endDrawing(drawingState.currentPoint || drawingState.startPoint as Point);
  }, [setIsDrawing, endDrawing, drawingState]);

  const handleCancelDrawing = useCallback((): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove temporary objects
    if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
      canvas.remove(currentLineRef.current);
    }
    
    if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // Reset state
    resetDrawingState();
    cancelToolDrawing();
    
    // Render updates
    canvas.renderAll();
    
    logger.info('Cancelled straight line drawing');
  }, [fabricCanvasRef, currentLineRef, distanceTooltipRef, resetDrawingState, cancelToolDrawing]);

  // Hook up our event handlers
  useEffect(() => {
    if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>): void => {
      if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
      
      // Use our grid-snapping mouseHandlers
      mouseHandlers.handleMouseDown(opt.e as MouseEvent);
    };
    
    const handleMouseMove = (opt: TPointerEventInfo<TPointerEvent>): void => {
      if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
      if (!isDrawing) return;
      
      mouseHandlers.handleMouseMove(opt.e as MouseEvent);
    };
    
    const handleMouseUp = (opt: TPointerEventInfo<TPointerEvent>): void => {
      if (tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.LINE) return;
      if (!isDrawing) return;
      
      handleEndDrawing();
    };
    
    // Add event listeners using FabricEventNames enum
    canvas.on(FabricEventNames.MOUSE_DOWN, handleMouseDown as any);
    canvas.on(FabricEventNames.MOUSE_MOVE, handleMouseMove as any);
    canvas.on(FabricEventNames.MOUSE_UP, handleMouseUp as any);
    
    return () => {
      // Remove event listeners
      canvas.off(FabricEventNames.MOUSE_DOWN, handleMouseDown as any);
      canvas.off(FabricEventNames.MOUSE_MOVE, handleMouseMove as any);
      canvas.off(FabricEventNames.MOUSE_UP, handleMouseUp as any);
    };
  }, [tool, isDrawing, fabricCanvasRef, mouseHandlers, handleEndDrawing]);

  return {
    isActive: (tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.LINE) && isToolInitialized,
    isToolInitialized,
    currentLine: currentLineRef.current,
    isDrawing: isDrawing,
    cancelDrawing: handleCancelDrawing
  };
};
