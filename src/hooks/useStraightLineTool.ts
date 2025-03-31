
/**
 * Hook for handling straight line drawing with measurement
 * @module hooks/useStraightLineTool
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import type { Point } from '@/types/core/Point';
import logger from '@/utils/logger';
import { captureMessage, captureError } from '@/utils/sentry';

// Helper functions for measurement
const pixelsToMeters = (pixels: number): number => {
  return pixels / GRID_CONSTANTS.PIXELS_PER_METER;
};

const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
};

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for straight line drawing with measurement functionality
 */
export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps) => {
  // State for tracking line drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const tooltipRef = useRef<Text | null>(null);
  const toolInitializedRef = useRef(false);
  const mouseDownHandledRef = useRef(false);
  const mouseMoveCountRef = useRef(0);
  const eventHandlersRegisteredRef = useRef(false);

  // Get snapping functionality
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();

  // Log when tool becomes active
  useEffect(() => {
    if (tool === DrawingMode.STRAIGHT_LINE) {
      captureMessage('Straight line tool activated', 'straight-line-activated', {
        tags: { component: 'useStraightLineTool' },
        extra: { 
          lineColor, 
          lineThickness,
          hasCanvas: !!fabricCanvasRef.current,
          canvasProps: fabricCanvasRef.current ? {
            width: fabricCanvasRef.current.width,
            height: fabricCanvasRef.current.height,
            isDrawingMode: fabricCanvasRef.current.isDrawingMode,
            selection: fabricCanvasRef.current.selection
          } : null
        }
      });
      logger.info('Straight line tool activated', { 
        lineColor, 
        lineThickness,
        eventHandlersRegistered: eventHandlersRegisteredRef.current
      });
      
      // Reset diagnostic counters
      mouseDownHandledRef.current = false;
      mouseMoveCountRef.current = 0;
    }
  }, [tool, lineColor, lineThickness, fabricCanvasRef]);

  /**
   * Create or update distance tooltip
   * @param start - Start point
   * @param end - End point
   * @param canvas - Fabric canvas
   * @returns Distance information
   */
  const updateMeasurementTooltip = useCallback((start: Point, end: Point, canvas: FabricCanvas) => {
    try {
      // Calculate distance
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Convert to meters
      const distanceInMeters = pixelsToMeters(distance).toFixed(1);
      
      // Calculate midpoint for tooltip position
      const midpoint = calculateMidpoint(start, end);
      const midX = midpoint.x;
      const midY = midpoint.y - 15; // Position above the line
      
      // Create or update tooltip
      if (!tooltipRef.current) {
        tooltipRef.current = new Text(`${distanceInMeters} m`, {
          left: midX,
          top: midY,
          fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
          fill: GRID_CONSTANTS.MARKER_COLOR,
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: 5,
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          selectable: false,
          objectType: 'measurement'
        });
        canvas.add(tooltipRef.current);
        logger.info('Created measurement tooltip', { distanceInMeters, position: { x: midX, y: midY } });
      } else {
        tooltipRef.current.set({
          text: `${distanceInMeters} m`,
          left: midX,
          top: midY
        });
      }
      
      canvas.renderAll();
      
      return { distance, distanceInMeters };
    } catch (error) {
      logger.error('Error updating measurement tooltip', error);
      captureError(error as Error, 'measurement-tooltip-error', {
        extra: { startPoint: start, endPoint: end }
      });
      return { distance: 0, distanceInMeters: '0.0' };
    }
  }, []);

  /**
   * Handle mouse down event for straight line drawing
   */
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!fabricCanvasRef.current || tool !== DrawingMode.STRAIGHT_LINE) {
      logger.info('Mouse down ignored - not in straight line mode', { 
        hasCanvas: !!fabricCanvasRef.current, 
        currentTool: tool,
        expectedTool: DrawingMode.STRAIGHT_LINE,
        toolComparison: tool === DrawingMode.STRAIGHT_LINE ? 'equal' : 'not equal',
        toolTypeOf: typeof tool
      });
      return;
    }
    
    e.preventDefault(); // Prevent default browser behavior
    
    const canvas = fabricCanvasRef.current;
    
    // Get pointer position from event
    const pointer = canvas.getPointer(e);
    
    logger.info('Mouse down in straight line tool', { 
      pointer, 
      tool, 
      isCorrectTool: tool === DrawingMode.STRAIGHT_LINE,
      event: { 
        type: e.type, 
        clientX: e.clientX,
        clientY: e.clientY,
        button: e.button 
      }
    });
    
    // Mark that we handled a mouse down event for diagnostic purposes
    mouseDownHandledRef.current = true;
    
    // Start drawing
    setIsDrawing(true);
    
    // Always snap point to grid for better precision
    const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
    
    // Save start point
    startPointRef.current = snappedPoint;
    
    // Create initial line
    currentLineRef.current = new Line(
      [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
      {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false,
        objectType: 'straight-line'
      }
    );
    
    canvas.add(currentLineRef.current);
    canvas.requestRenderAll();
    
    logger.info('Started drawing straight line', { point: snappedPoint });
    
    // Capture analytics
    captureMessage('Straight line drawing started', 'straight-line-started', {
      tags: { component: 'useStraightLineTool' },
      extra: { 
        startPoint: snappedPoint,
        canvasState: {
          objectCount: canvas.getObjects().length,
          isDrawingMode: canvas.isDrawingMode,
          selection: canvas.selection
        }
      }
    });
  }, [fabricCanvasRef, tool, lineColor, lineThickness, snapPointToGrid]);

  /**
   * Handle mouse move event for straight line drawing
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!fabricCanvasRef.current || !isDrawing || !startPointRef.current || !currentLineRef.current) {
      return;
    }
    
    e.preventDefault(); // Prevent default browser behavior
    
    // Increment move count for diagnostics
    mouseMoveCountRef.current++;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    
    // Log the first few mouse moves for diagnostic purposes
    if (mouseMoveCountRef.current <= 3) {
      logger.info(`Mouse move #${mouseMoveCountRef.current} in straight line drawing`, {
        pointer,
        startPoint: startPointRef.current,
        event: { 
          type: e.type, 
          clientX: e.clientX,
          clientY: e.clientY
        }
      });
    }
    
    // Always snap the end point to grid
    const currentPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
    
    // Apply additional constraints for horizontal/vertical/diagonal lines
    const { start, end } = snapLineToGrid(startPointRef.current, currentPoint);
    
    // Update line
    currentLineRef.current.set({
      x2: end.x,
      y2: end.y
    });
    
    // Update measurement tooltip
    updateMeasurementTooltip(start, end, canvas);
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, snapPointToGrid, snapLineToGrid, updateMeasurementTooltip]);

  /**
   * Handle mouse up event for straight line drawing
   */
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!fabricCanvasRef.current || !isDrawing || !startPointRef.current || !currentLineRef.current) {
      if (isDrawing) {
        // This is a problematic case - we were drawing but lost some state
        logger.error('Mouse up with inconsistent drawing state', {
          isDrawing,
          hasCanvas: !!fabricCanvasRef.current,
          hasStartPoint: !!startPointRef.current,
          hasLine: !!currentLineRef.current,
          tool
        });
        
        captureError(
          new Error('Mouse up with inconsistent drawing state'), 
          'straight-line-state-error',
          {
            extra: {
              isDrawing,
              hasCanvas: !!fabricCanvasRef.current,
              hasStartPoint: !!startPointRef.current,
              hasLine: !!currentLineRef.current,
              mouseDownHandled: mouseDownHandledRef.current,
              mouseMoveCount: mouseMoveCountRef.current,
              tool
            }
          }
        );
      }
      return;
    }
    
    e.preventDefault(); // Prevent default browser behavior
    
    const canvas = fabricCanvasRef.current;
    
    // End drawing
    setIsDrawing(false);
    
    // Get end point
    const end = { 
      x: currentLineRef.current.x2 as number, 
      y: currentLineRef.current.y2 as number 
    };
    
    // Calculate distance
    const dx = end.x - startPointRef.current.x;
    const dy = end.y - startPointRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    logger.info('Finishing straight line drawing', {
      distance,
      startPoint: startPointRef.current,
      endPoint: end,
      mouseMoveCount: mouseMoveCountRef.current
    });
    
    // Only keep the line if it has a meaningful length (more than 5 pixels)
    if (distance > 5) {
      // Save state for undo
      saveCurrentState();
      
      // Convert to meters (using PIXELS_PER_METER constant)
      const distanceInMeters = pixelsToMeters(distance).toFixed(1);
      
      // Make line selectable and store measurement
      currentLineRef.current.set({
        selectable: true,
        evented: true,
        objectType: 'straight-line',
        measurement: `${distanceInMeters} m`
      });
      
      // Make measurement persistent
      if (tooltipRef.current) {
        tooltipRef.current.set({
          selectable: false,
          evented: true,
          objectType: 'measurement'
        });
      }
      
      logger.info('Completed straight line drawing', {
        startPoint: startPointRef.current,
        endPoint: end,
        distance: distanceInMeters,
        canvasObjectCount: canvas.getObjects().length
      });
      
      toast.success(`Line drawn: ${distanceInMeters} m`);
      
      // Capture analytics
      captureMessage('Straight line drawing completed', 'straight-line-completed', {
        tags: { component: 'useStraightLineTool' },
        extra: { 
          startPoint: startPointRef.current,
          endPoint: end,
          distance: distanceInMeters,
          mouseMoveCount: mouseMoveCountRef.current,
          objectCount: canvas.getObjects().length
        }
      });
    } else {
      // Line too short, remove it
      canvas.remove(currentLineRef.current);
      if (tooltipRef.current) {
        canvas.remove(tooltipRef.current);
      }
      
      // Log diagnostic information for short lines
      captureMessage('Straight line discarded - too short', 'straight-line-discarded', {
        tags: { component: 'useStraightLineTool' },
        extra: {
          distance,
          startPoint: startPointRef.current,
          endPoint: end,
          threshold: 5,
          mouseMoveCount: mouseMoveCountRef.current
        }
      });
      
      logger.info('Discarded straight line - too short', { distance });
    }
    
    // Reset state
    startPointRef.current = null;
    currentLineRef.current = null;
    tooltipRef.current = null;
    mouseDownHandledRef.current = false;
    mouseMoveCountRef.current = 0;
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, saveCurrentState, snapPointToGrid, tool]);

  /**
   * Set up event listeners when tool is active
   * CRITICAL CHANGE: Using direct DOM event listeners instead of relying on canvas events
   * which may not be properly set up or propagated
   */
  useEffect(() => {
    logger.info('Straight line tool effect running', { 
      currentTool: tool, 
      isCorrectTool: tool === DrawingMode.STRAIGHT_LINE,
      hasCanvas: !!fabricCanvasRef.current,
      toolCompareResult: `${tool} === ${DrawingMode.STRAIGHT_LINE} is ${tool === DrawingMode.STRAIGHT_LINE}`
    });
    
    if (tool !== DrawingMode.STRAIGHT_LINE) {
      toolInitializedRef.current = false;
      eventHandlersRegisteredRef.current = false;
      return;
    }
    
    if (!fabricCanvasRef.current) {
      logger.error('Canvas reference is null in straight line tool');
      captureError(
        new Error('Canvas reference is null in straight line tool'), 
        'straight-line-null-canvas-ref',
        { tags: { component: 'useStraightLineTool' } }
      );
      return;
    }

    try {
      // Important: We now add event listeners directly to the canvas DOM element
      // instead of using fabric's event system which might be having issues
      const canvasElement = fabricCanvasRef.current.getElement();
      
      // Add event listeners directly to canvas element
      canvasElement.addEventListener('mousedown', handleMouseDown as any);
      canvasElement.addEventListener('mousemove', handleMouseMove as any);
      canvasElement.addEventListener('mouseup', handleMouseUp as any);
      
      // Also add to window to catch events that might occur outside canvas
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      logger.info('Straight line tool event listeners added directly to canvas DOM element', {
        canvasElementId: canvasElement.id,
        canvasElementWidth: canvasElement.width,
        canvasElementHeight: canvasElement.height
      });
      
      eventHandlersRegisteredRef.current = true;
      
      // Set canvas properties for straight line tool
      const canvas = fabricCanvasRef.current;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      canvas.selection = false;
      
      // Disable selection mode when in straight line tool
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if ((obj as any).objectType !== 'grid' && (obj as any).objectType !== 'measurement') {
          obj.selectable = false;
        }
      });
      
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      
      logger.info('Straight line tool canvas settings applied', {
        cursor: canvas.defaultCursor,
        selection: canvas.selection,
        objectCount: objects.length
      });
      
      // Add diagnostic info to Sentry
      captureMessage('Straight line tool initialized', 'straight-line-initialized', {
        tags: { component: 'useStraightLineTool' },
        extra: {
          canvasProps: {
            width: canvas.width,
            height: canvas.height,
            cursor: canvas.defaultCursor,
            selection: canvas.selection,
            isDrawingMode: canvas.isDrawingMode,
            objectCount: canvas.getObjects().length
          },
          lineSettings: {
            color: lineColor,
            thickness: lineThickness
          },
          domEventListeners: true
        }
      });
      
      toolInitializedRef.current = true;
      
      // Test the event handling immediately with a synthetic event
      const testEvent = new CustomEvent('test-straight-line');
      logger.info('Testing straight line event handling', {
        isRegistered: eventHandlersRegisteredRef.current,
        isToolInitialized: toolInitializedRef.current,
        hasMouseDownHandler: !!handleMouseDown
      });
    } catch (error) {
      logger.error('Error initializing straight line tool', error);
      captureError(error as Error, 'straight-line-init-error', {
        extra: { tool, lineColor, lineThickness }
      });
    }
    
    // Clean up
    return () => {
      logger.info('Straight line tool cleanup running');
      
      try {
        if (fabricCanvasRef.current) {
          const canvasElement = fabricCanvasRef.current.getElement();
          
          // Remove event listeners from canvas element
          canvasElement.removeEventListener('mousedown', handleMouseDown as any);
          canvasElement.removeEventListener('mousemove', handleMouseMove as any);
          canvasElement.removeEventListener('mouseup', handleMouseUp as any);
        }
        
        // Always remove window listeners
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        
        // Reset cursor
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.defaultCursor = 'default';
          
          // Re-enable selection for objects when switching away
          if (tool !== DrawingMode.STRAIGHT_LINE) {
            const objects = fabricCanvasRef.current.getObjects();
            objects.forEach(obj => {
              if ((obj as any).objectType !== 'grid' && (obj as any).objectType !== 'measurement') {
                obj.selectable = true;
              }
            });
            fabricCanvasRef.current.requestRenderAll();
          }
        }
        
        // Clean up any in-progress drawing
        if (isDrawing && fabricCanvasRef.current) {
          if (currentLineRef.current) {
            fabricCanvasRef.current.remove(currentLineRef.current);
          }
          if (tooltipRef.current) {
            fabricCanvasRef.current.remove(tooltipRef.current);
          }
          setIsDrawing(false);
          
          // Log cleanup of in-progress drawing
          captureMessage('Cleaned up in-progress straight line drawing', 'straight-line-cleanup', {
            tags: { component: 'useStraightLineTool' }
          });
        }
        
        eventHandlersRegisteredRef.current = false;
      } catch (error) {
        logger.error('Error during straight line tool cleanup', error);
        captureError(error as Error, 'straight-line-cleanup-error');
      }
    };
  }, [tool, handleMouseDown, handleMouseMove, handleMouseUp, fabricCanvasRef, isDrawing, lineColor, lineThickness]);

  /**
   * Cancel current drawing (useful for escape key)
   */
  const cancelDrawing = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing) return;
    
    const canvas = fabricCanvasRef.current;
    
    try {
      // Remove current line and tooltip
      if (currentLineRef.current) {
        canvas.remove(currentLineRef.current);
      }
      if (tooltipRef.current) {
        canvas.remove(tooltipRef.current);
      }
      
      // Reset state
      setIsDrawing(false);
      startPointRef.current = null;
      currentLineRef.current = null;
      tooltipRef.current = null;
      mouseDownHandledRef.current = false;
      mouseMoveCountRef.current = 0;
      
      canvas.renderAll();
      logger.info('Cancelled drawing straight line');
      
      captureMessage('Straight line drawing cancelled', 'straight-line-cancelled', {
        tags: { component: 'useStraightLineTool' }
      });
    } catch (error) {
      logger.error('Error cancelling straight line drawing', error);
      captureError(error as Error, 'straight-line-cancel-error');
    }
  }, [fabricCanvasRef, isDrawing]);

  return {
    isDrawing,
    cancelDrawing,
    isToolInitialized: toolInitializedRef.current,
    // Export handler functions directly to allow other components to use them
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
