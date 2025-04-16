
import { useRef, useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { useGridSnapping } from './useGridSnapping';
import { createPoint } from '@/utils/pointHelpers';

interface UseWallDrawingProps {
  canvas: FabricCanvas | null;
  lineThickness: number;
  lineColor: string;
  gridSnappingEnabled?: boolean;
  onWallCreated?: (startPoint: Point, endPoint: Point) => void;
}

export const useWallDrawing = ({
  canvas,
  lineThickness,
  lineColor,
  gridSnappingEnabled = true,
  onWallCreated
}: UseWallDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);

  // Get grid snapping functionality
  const { snapPointToGrid, snapLineToGrid, snapEnabled, toggleSnap } = useGridSnapping(gridSnappingEnabled);

  const startDrawing = useCallback((point: Point) => {
    if (!canvas) return;
    
    // Snap the point to grid if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    startPointRef.current = snappedPoint;
    
    // Create a temporary line
    const line = new Line(
      [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
      {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false,
        objectType: 'wall-preview'
      }
    );
    
    canvas.add(line);
    currentLineRef.current = line;
    setIsDrawing(true);
  }, [canvas, lineColor, lineThickness, snapEnabled, snapPointToGrid]);

  const continueDrawing = useCallback((point: Point) => {
    if (!canvas || !isDrawing || !startPointRef.current || !currentLineRef.current) return;
    
    // Snap the current point to grid if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update the line points
    currentLineRef.current.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y
    });
    
    canvas.renderAll();
  }, [canvas, isDrawing, snapEnabled, snapPointToGrid]);

  const finishDrawing = useCallback((point: Point) => {
    if (!canvas || !isDrawing || !startPointRef.current) return;
    
    // Remove the preview line
    if (currentLineRef.current) {
      canvas.remove(currentLineRef.current);
    }
    
    // Snap the end point to grid if enabled
    const endPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Don't create wall if start and end points are too close
    const dx = endPoint.x - startPointRef.current.x;
    const dy = endPoint.y - startPointRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 5) {
      setIsDrawing(false);
      startPointRef.current = null;
      currentLineRef.current = null;
      return;
    }
    
    // Create the final wall
    const snappedPoints = snapLineToGrid(startPointRef.current, endPoint);
    
    // Create a permanent line
    const line = new Line(
      [
        snappedPoints.start.x,
        snappedPoints.start.y,
        snappedPoints.end.x,
        snappedPoints.end.y
      ],
      {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        objectType: 'wall'
      }
    );
    
    canvas.add(line);
    canvas.renderAll();
    
    // Call the callback if provided
    if (onWallCreated) {
      onWallCreated(createPoint(snappedPoints.start.x, snappedPoints.start.y), 
                   createPoint(snappedPoints.end.x, snappedPoints.end.y));
    }
    
    // Reset state
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
  }, [canvas, isDrawing, lineColor, lineThickness, onWallCreated, snapEnabled, snapPointToGrid, snapLineToGrid]);

  const cancelDrawing = useCallback(() => {
    if (!canvas || !currentLineRef.current) return;
    
    canvas.remove(currentLineRef.current);
    canvas.renderAll();
    
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
  }, [canvas]);

  return {
    isDrawing,
    startDrawing,
    continueDrawing,
    finishDrawing,
    cancelDrawing,
    snapEnabled,
    toggleSnap
  };
};
