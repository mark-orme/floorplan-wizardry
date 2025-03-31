
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

  // Get snapping functionality
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();

  // Log when tool becomes active
  useEffect(() => {
    if (tool === DrawingMode.STRAIGHT_LINE) {
      captureMessage('Straight line tool activated', 'straight-line-activated', {
        tags: { component: 'useStraightLineTool' },
        extra: { lineColor, lineThickness }
      });
      logger.info('Straight line tool activated', { lineColor, lineThickness });
    }
  }, [tool, lineColor, lineThickness]);

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
        currentTool: tool 
      });
      return;
    }
    
    e.preventDefault(); // Prevent default browser behavior
    
    const canvas = fabricCanvasRef.current;
    
    // Get pointer position from event
    const pointer = canvas.getPointer(e);
    
    logger.info('Starting straight line drawing', { 
      pointer, 
      tool, 
      isCorrectTool: tool === DrawingMode.STRAIGHT_LINE 
    });
    
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
    canvas.renderAll();
    
    logger.info('Started drawing straight line', { point: snappedPoint });
    
    // Capture analytics
    captureMessage('Straight line drawing started', 'straight-line-started', {
      tags: { component: 'useStraightLineTool' },
      extra: { startPoint: snappedPoint }
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
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    
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
        distance: distanceInMeters
      });
      
      toast.success(`Line drawn: ${distanceInMeters} m`);
      
      // Capture analytics
      captureMessage('Straight line drawing completed', 'straight-line-completed', {
        tags: { component: 'useStraightLineTool' },
        extra: { 
          startPoint: startPointRef.current,
          endPoint: end,
          distance: distanceInMeters
        }
      });
    } else {
      // Line too short, remove it
      canvas.remove(currentLineRef.current);
      if (tooltipRef.current) {
        canvas.remove(tooltipRef.current);
      }
      logger.info('Discarded straight line - too short', { distance });
    }
    
    // Reset state
    startPointRef.current = null;
    currentLineRef.current = null;
    tooltipRef.current = null;
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, saveCurrentState, snapPointToGrid]);

  /**
   * Set up event listeners when tool is active
   */
  useEffect(() => {
    logger.info('Straight line tool effect running', { 
      currentTool: tool, 
      isCorrectTool: tool === DrawingMode.STRAIGHT_LINE,
      hasCanvas: !!fabricCanvasRef.current
    });
    
    if (tool !== DrawingMode.STRAIGHT_LINE) {
      toolInitializedRef.current = false;
      return;
    }
    
    if (!fabricCanvasRef.current) {
      logger.error('Canvas reference is null in straight line tool');
      return;
    }
    
    // Add event listeners directly to window to ensure they're not missed
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    logger.info('Straight line tool event listeners added');
    
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
    
    logger.info('Straight line tool canvas settings applied');
    toolInitializedRef.current = true;
    
    // Clean up
    return () => {
      logger.info('Straight line tool cleanup running');
      window.removeEventListener('mousedown', handleMouseDown);
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
      }
    };
  }, [tool, handleMouseDown, handleMouseMove, handleMouseUp, fabricCanvasRef, isDrawing]);

  /**
   * Cancel current drawing (useful for escape key)
   */
  const cancelDrawing = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing) return;
    
    const canvas = fabricCanvasRef.current;
    
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
    
    canvas.renderAll();
    logger.info('Cancelled drawing straight line');
  }, [fabricCanvasRef, isDrawing]);

  return {
    isDrawing,
    cancelDrawing,
    isToolInitialized: toolInitializedRef.current
  };
};
