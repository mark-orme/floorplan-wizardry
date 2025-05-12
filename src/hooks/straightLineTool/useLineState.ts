
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';
import useLineAngleSnap from './useLineAngleSnap';

interface UseLineStateOptions {
  gridSnapping?: boolean;
  gridSize?: number;
}

/**
 * Hook for managing line drawing state
 */
export const useLineState = ({ 
  gridSnapping = false,
  gridSize = 20
}: UseLineStateOptions = {}) => {
  // Line state
  const [start, setStart] = useState<Point | null>(null);
  const [end, setEnd] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Grid snapping
  const [snapToGrid, setSnapToGrid] = useState(gridSnapping);
  
  // Angle snapping
  const { snapAngle, isEnabled: anglesEnabled, setEnabled: setAnglesEnabled, toggleEnabled: toggleAngles } = useLineAngleSnap();
  
  // Start drawing from a point
  const startDrawing = useCallback((point: Point) => {
    const snappedPoint = snapToGrid ? {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    } : point;

    setStart(snappedPoint);
    setEnd(snappedPoint);
    setIsDrawing(true);
  }, [gridSize, snapToGrid]);
  
  // Update line while drawing
  const updateLine = useCallback((point: Point) => {
    if (!isDrawing || !start) return;
    
    // Apply grid snapping if enabled
    let snappedPoint = snapToGrid ? {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    } : point;
    
    // Apply angle snapping if enabled
    if (anglesEnabled && start) {
      const result = snapAngle(start, snappedPoint);
      snappedPoint = result.point;
    }
    
    setEnd(snappedPoint);
  }, [isDrawing, start, snapToGrid, gridSize, anglesEnabled, snapAngle]);
  
  // Finish drawing
  const finishDrawing = useCallback(() => {
    if (!isDrawing || !start || !end) return null;
    
    const line = { start, end };
    setIsDrawing(false);
    setStart(null);
    setEnd(null);
    return line;
  }, [isDrawing, start, end]);
  
  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setStart(null);
    setEnd(null);
  }, []);
  
  // Toggle grid snapping
  const toggleGridSnap = useCallback(() => {
    setSnapToGrid(prev => !prev);
  }, []);
  
  // Additional method to maintain compatibility
  const snapToAngle = useCallback((start: Point, end: Point): Point => {
    const result = snapAngle(start, end);
    return result.point;
  }, [snapAngle]);
  
  return {
    start,
    end,
    isDrawing,
    startDrawing,
    updateLine,
    finishDrawing,
    cancelDrawing,
    snapToGrid,
    toggleGridSnap,
    setSnapToGrid,
    anglesEnabled,
    setAnglesEnabled,
    toggleAngles,
    snapToAngle
  };
};

export default useLineState;
