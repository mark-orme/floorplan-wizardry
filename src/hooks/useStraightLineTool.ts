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

  // Get snapping functionality
  const { snapPointToGrid, snapLineToGrid, snapEnabled } = useSnapToGrid();

  /**
   * Convert pixels to meters
   * @param pixelDistance - Distance in pixels
   * @returns Distance in meters
   */
  const pixelsToMeters = useCallback((pixelDistance: number): number => {
    return pixelDistance / GRID_CONSTANTS.PIXELS_PER_METER;
  }, []);

  /**
   * Create or update distance tooltip
   * @param start - Start point
   * @param end - End point
   * @param canvas - Fabric canvas
   * @returns Distance information
   */
  const updateMeasurementTooltip = useCallback((start: Point, end: Point, canvas: FabricCanvas) => {
    // Calculate distance
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Convert to meters
    const distanceInMeters = pixelsToMeters(distance).toFixed(1);
    
    // Calculate midpoint for tooltip position
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 15; // Position above the line
    
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
    } else {
      tooltipRef.current.set({
        text: `${distanceInMeters} m`,
        left: midX,
        top: midY
      });
    }
    
    canvas.renderAll();
    
    return { distance, distanceInMeters };
  }, [pixelsToMeters]);

  /**
   * Handle mouse down event for straight line drawing
   */
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!fabricCanvasRef.current || tool !== DrawingMode.STRAIGHT_LINE) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    
    // Start drawing
    setIsDrawing(true);
    
    // Snap point to grid if enabled
    const snappedPoint = snapEnabled 
      ? snapPointToGrid({ x: pointer.x, y: pointer.y })
      : { x: pointer.x, y: pointer.y };
    
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
  }, [fabricCanvasRef, tool, lineColor, lineThickness, snapEnabled, snapPointToGrid]);

  /**
   * Handle mouse move event for straight line drawing
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!fabricCanvasRef.current || !isDrawing || !startPointRef.current || !currentLineRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    
    // Snap point to grid if enabled
    const currentPoint = snapEnabled 
      ? snapPointToGrid({ x: pointer.x, y: pointer.y })
      : { x: pointer.x, y: pointer.y };
    
    // Apply additional constraints if needed (like straight horizontal/vertical lines)
    const { start, end } = snapEnabled
      ? snapLineToGrid(startPointRef.current, currentPoint)
      : { start: startPointRef.current, end: currentPoint };
    
    // Update line
    currentLineRef.current.set({
      x2: end.x,
      y2: end.y
    });
    
    // Update measurement tooltip
    updateMeasurementTooltip(start, end, canvas);
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, snapEnabled, snapPointToGrid, snapLineToGrid, updateMeasurementTooltip]);

  /**
   * Handle mouse up event for straight line drawing
   */
  const handleMouseUp = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing || !startPointRef.current || !currentLineRef.current) return;
    
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
      
      // Convert to meters
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
      
      toast.success(`Line drawn: ${distanceInMeters} m`);
    } else {
      // Line too short, remove it
      canvas.remove(currentLineRef.current);
      if (tooltipRef.current) {
        canvas.remove(tooltipRef.current);
      }
    }
    
    // Reset state
    startPointRef.current = null;
    currentLineRef.current = null;
    tooltipRef.current = null;
    
    canvas.renderAll();
    logger.info('Finished drawing straight line');
  }, [fabricCanvasRef, isDrawing, saveCurrentState, pixelsToMeters]);

  /**
   * Set up event listeners when tool is active
   */
  useEffect(() => {
    if (tool !== DrawingMode.STRAIGHT_LINE) return;
    
    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Set cursor
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.defaultCursor = 'crosshair';
    }
    
    // Clean up
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Reset cursor
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.defaultCursor = 'default';
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
    cancelDrawing
  };
};
