import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { Point, createPoint } from '@/types/core/Point';
import { useLineDistance } from './useLineDistance';
import { useLineEvents } from './useLineEvents';
import { useLineSnapping } from './useLineSnapping';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useApplePencilSupport } from './useApplePencilSupport';
import { toolsLogger } from '@/utils/logger';

interface UseStraightLineToolProps {
  isEnabled: boolean;
  canvas: Canvas | null;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
}

export interface StraightLineState {
  isDrawing: boolean;
  startPoint: Point;
  currentPoint: Point;
  activeLine: any;
  distanceTooltip: any;
  isActive: boolean;
  snapEnabled: boolean;
}

/**
 * Hook that provides straight line drawing functionality
 */
export const useStraightLineTool = ({
  isEnabled,
  canvas,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps) => {
  // Initialize state with default values
  const [isDrawing, setIsDrawing] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const lineRef = useRef<any>(null);
  const tooltipRef = useRef<any>(null);
  
  // Track points for the current line
  const startPointRef = useRef<Point>(createPoint(0, 0));
  const currentPointRef = useRef<Point>(createPoint(0, 0));
  
  // Use distance calculation utility
  const { calculateDistance, updateDistanceTooltip } = useLineDistance();
  
  // Use enhanced grid snapping
  const { snapToGrid, toggleGridSnapping } = useEnhancedGridSnapping({
    initialSnapEnabled: snapEnabled
  });
  
  // Set drawing mode when enabled changes
  useEffect(() => {
    if (!canvas) return;
    
    // Enable drawing mode when tool is enabled
    if (isEnabled) {
      toolsLogger.debug("Straight line tool enabled");
    } else {
      toolsLogger.debug("Straight line tool disabled");
      // Cancel any active drawing when tool is disabled
      cancelDrawing();
    }
  }, [isEnabled, canvas]);
  
  // Handle mouse down to start drawing a line
  const handleMouseDown = useCallback((point: Point) => {
    if (!canvas || !isEnabled || isDrawing) return;
    
    // Set the start point
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    startPointRef.current = snappedPoint;
    currentPointRef.current = snappedPoint;
    
    setIsDrawing(true);
    toolsLogger.debug("Started drawing line", { point: snappedPoint });
    
  }, [canvas, isEnabled, isDrawing, snapEnabled, snapToGrid]);
  
  // Handle mouse move to update the current line
  const handleMouseMove = useCallback((point: Point) => {
    if (!canvas || !isEnabled || !isDrawing) return;
    
    // Update the current point with snapping if enabled
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    currentPointRef.current = snappedPoint;
    
    // Create or update the line
    if (!lineRef.current) {
      // Create a new line
      lineRef.current = createLine(startPointRef.current, snappedPoint);
    } else {
      // Update the existing line
      updateLine(lineRef.current, snappedPoint);
    }
    
    // Update distance tooltip
    if (lineRef.current) {
      const distance = calculateDistance(startPointRef.current, snappedPoint);
      updateDistanceTooltip(distance, startPointRef.current, snappedPoint, tooltipRef);
    }
    
  }, [canvas, isEnabled, isDrawing, snapEnabled, snapToGrid, calculateDistance]);
  
  // Handle mouse up to finish drawing a line
  const handleMouseUp = useCallback(() => {
    if (!canvas || !isEnabled || !isDrawing) return;
    
    // Finalize the line
    if (lineRef.current) {
      // Calculate the final distance
      const distance = calculateDistance(startPointRef.current, currentPointRef.current);
      
      // Only keep the line if it has a meaningful length
      if (distance > 5) {
        if (saveCurrentState) {
          saveCurrentState();
        }
        toolsLogger.debug("Line created", { distance });
      } else {
        // Remove the line if it's too short
        canvas.remove(lineRef.current);
        toolsLogger.debug("Line discarded (too short)");
      }
    }
    
    // Reset the state
    setIsDrawing(false);
    lineRef.current = null;
    
    // Remove the tooltip if it exists
    if (tooltipRef.current) {
      canvas.remove(tooltipRef.current);
      tooltipRef.current = null;
    }
    
  }, [canvas, isEnabled, isDrawing, saveCurrentState, calculateDistance]);
  
  // Cancel drawing (e.g., on key press)
  const cancelDrawing = useCallback(() => {
    if (!canvas || !isDrawing) return;
    
    // Remove the line and tooltip
    if (lineRef.current) {
      canvas.remove(lineRef.current);
      lineRef.current = null;
    }
    
    if (tooltipRef.current) {
      canvas.remove(tooltipRef.current);
      tooltipRef.current = null;
    }
    
    // Reset state
    setIsDrawing(false);
    toolsLogger.debug("Drawing cancelled");
    
  }, [canvas, isDrawing]);
  
  // Helper functions for creating and updating lines
  const createLine = (start: Point, end: Point) => {
    if (!canvas) return null;
    
    const line = new fabric.Line([
      start.x, start.y, end.x, end.y
    ], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
      strokeLineCap: 'round',
      strokeLineJoin: 'round'
    });
    
    canvas.add(line);
    canvas.renderAll();
    
    return line;
  };
  
  const updateLine = (line: any, end: Point) => {
    if (!line) return;
    
    line.set({ 
      x2: end.x,
      y2: end.y 
    });
    
    canvas?.renderAll();
  };
  
  // Register Apple Pencil support
  useApplePencilSupport({
    canvas,
    snapToGrid: snapEnabled
  });
  
  // Return the public API
  return {
    isActive: isEnabled,
    isDrawing,
    snapEnabled,
    toggleGridSnapping: () => setSnapEnabled(!snapEnabled),
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing
  };
};
