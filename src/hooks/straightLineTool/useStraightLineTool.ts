
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
import { Point } from '@/types/core/Geometry';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import logger from '@/utils/logger';

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
    if (tool === DrawingMode.STRAIGHT_LINE && !isToolInitialized) {
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
    if (tool !== DrawingMode.STRAIGHT_LINE) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // If drawing just started, create a line
    if (drawingState.isDrawing && drawingState.points.length === 1 && !currentLineRef.current) {
      const startPoint = drawingState.startPoint;
      if (!startPoint) return;
      
      try {
        // Create initial line
        const line = new Line([
          startPoint.x, 
          startPoint.y, 
          startPoint.x, 
          startPoint.y
        ], {
          stroke: lineColor,
          strokeWidth: lineThickness,
          selectable: false,
          evented: false
        });
        
        // Create distance tooltip
        const tooltip = new Text('0 px', {
          left: startPoint.x,
          top: startPoint.y,
          fontSize: 12,
          fill: lineColor,
          selectable: false,
          evented: false
        });
        
        // Add to canvas
        canvas.add(line, tooltip);
        
        // Update refs
        setStartPoint(startPoint);
        setCurrentLine(line);
        setDistanceTooltip(tooltip);
        
        logger.info('Created initial straight line', { 
          startPoint,
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
        // Update line endpoints
        line.set({
          x2: currentPoint.x,
          y2: currentPoint.y
        });
        
        // Calculate distance and update tooltip
        const distance = calculateDistance(startPoint, currentPoint);
        tooltip.set({
          text: `${Math.round(distance)} px`,
          left: getMidpoint(startPoint, currentPoint).x,
          top: getMidpoint(startPoint, currentPoint).y - 15
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
          evented: true
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
    resetDrawingState
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
    if (tool !== DrawingMode.STRAIGHT_LINE) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleMouseDown = (e: Event): void => {
      if (tool !== DrawingMode.STRAIGHT_LINE) return;
      mouseHandlers.handleMouseDown(e as MouseEvent);
    };
    
    const handleMouseMove = (e: Event): void => {
      if (tool !== DrawingMode.STRAIGHT_LINE) return;
      if (!isDrawing) return;
      mouseHandlers.handleMouseMove(e as MouseEvent);
    };
    
    const handleMouseUp = (e: Event): void => {
      if (tool !== DrawingMode.STRAIGHT_LINE) return;
      if (!isDrawing) return;
      handleEndDrawing();
    };
    
    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    return () => {
      // Remove event listeners
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [tool, isDrawing, fabricCanvasRef, mouseHandlers, handleEndDrawing]);

  return {
    isActive: tool === DrawingMode.STRAIGHT_LINE && isToolInitialized,
    isToolInitialized,
    currentLine: currentLineRef.current,
    cancelDrawing: handleCancelDrawing
  };
};
