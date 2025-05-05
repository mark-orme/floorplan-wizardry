/**
 * @deprecated Import from '@/hooks/straightLineTool/useStraightLineTool' instead
 */

// Re-export from the new location for backward compatibility
export { useStraightLineTool } from './straightLineTool/useStraightLineTool';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Line, ILineOptions } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineStateCore } from './useLineStateCore';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { GRID_CONSTANTS } from '@/types/fabric-unified';
import { MeasurementData } from '@/types/fabric-unified';

export interface UseStraightLineToolOptions {
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  snapToAngle?: boolean;
}

export function useStraightLineTool(
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseStraightLineToolOptions = {}
) {
  const {
    lineColor = '#000000',
    lineThickness = 2,
    snapToGrid: initialSnapToGrid = true,
    snapToAngle: initialSnapToAngle = false,
  } = options;

  // Use the core line state hook
  const {
    isDrawing,
    setIsDrawing,
    startPoint,
    setStartPoint,
    currentPoint,
    setCurrentPoint,
    currentLine,
    setCurrentLine
  } = useLineStateCore();

  // Grid snapping functionality
  const {
    snapEnabled,
    setSnapEnabled,
    snapToGrid,
    toggleGridSnapping
  } = useEnhancedGridSnapping({
    initialSnapEnabled: initialSnapToGrid
  });

  // Angle snapping state
  const [snapAngleEnabled, setSnapAngleEnabled] = useState(initialSnapToAngle);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);

  // Toggle angle snapping
  const toggleAngleSnapping = useCallback(() => {
    setSnapAngleEnabled(prev => !prev);
  }, []);

  // Calculate mid point between two points
  const calculateMidPoint = useCallback((p1: Point, p2: Point): Point => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate angle between two points
  const calculateAngle = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  // Update measurement data with current line metrics
  const updateMeasurement = useCallback(() => {
    if (!startPoint || !currentPoint) return;

    const distance = calculateDistance(startPoint, currentPoint);
    const angle = calculateAngle(startPoint, currentPoint);
    const midPoint = calculateMidPoint(startPoint, currentPoint);

    setMeasurementData({
      distance,
      angle,
      startPoint,
      endPoint: currentPoint,
      midPoint,
      snapped: false,
      unit: 'px',
      pixelsPerMeter: GRID_CONSTANTS.PIXELS_PER_METER
    });
  }, [startPoint, currentPoint, calculateDistance, calculateAngle, calculateMidPoint]);

  // Create a line on the canvas
  const createLine = useCallback((start: Point, end: Point): Line => {
    if (!fabricCanvasRef.current) {
      throw new Error('Canvas is not initialized');
    }

    const lineOptions: ILineOptions = {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    };

    const line = new Line(
      [start.x, start.y, end.x, end.y],
      lineOptions
    );

    fabricCanvasRef.current.add(line);
    fabricCanvasRef.current.renderAll();
    return line;
  }, [fabricCanvasRef, lineColor, lineThickness]);

  // Update a line's coordinates
  const updateLine = useCallback((line: Line, start: Point, end: Point): void => {
    if (!line) return;

    line.set({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    });

    line.setCoords();
    
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.renderAll();
    }
  }, [fabricCanvasRef]);

  // Remove a line from the canvas
  const removeLine = useCallback((line: Line): void => {
    if (!line || !fabricCanvasRef.current) return;
    
    fabricCanvasRef.current.remove(line);
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);

  // Start line drawing
  const startDrawing = useCallback((point: Point) => {
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    setStartPoint(snappedPoint);
    setCurrentPoint(snappedPoint);
    setIsDrawing(true);
  }, [setStartPoint, setCurrentPoint, setIsDrawing, snapEnabled, snapToGrid]);

  // Continue line drawing
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    setCurrentPoint(snappedPoint);
    
    // Update or create the line
    if (currentLine) {
      updateLine(currentLine, startPoint, snappedPoint);
    } else {
      const newLine = createLine(startPoint, snappedPoint);
      setCurrentLine(newLine);
    }
    
    // Update measurement data
    updateMeasurement();
  }, [
    isDrawing, 
    startPoint, 
    currentLine, 
    snapEnabled, 
    snapToGrid, 
    updateLine, 
    createLine, 
    setCurrentPoint, 
    setCurrentLine, 
    updateMeasurement
  ]);

  // Complete line drawing
  const completeDrawing = useCallback(() => {
    setIsDrawing(false);
    
    // Reset the current line reference but keep it on canvas
    setCurrentLine(null);
  }, [setIsDrawing, setCurrentLine]);

  // Cancel line drawing
  const cancelDrawing = useCallback(() => {
    if (currentLine) {
      removeLine(currentLine);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setMeasurementData(null);
  }, [currentLine, removeLine, setIsDrawing, setStartPoint, setCurrentPoint, setCurrentLine]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (currentLine && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(currentLine);
      }
    };
  }, [currentLine, fabricCanvasRef]);

  // Return the hook API
  return {
    isDrawing,
    startPoint,
    currentPoint,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    snapEnabled,
    snapAngleEnabled,
    toggleGridSnapping,
    toggleAngleSnapping,
    setSnapEnabled,
    setSnapAngleEnabled,
    measurementData
  };
}

// Re-export the hook for backward compatibility
export { useStraightLineTool };
