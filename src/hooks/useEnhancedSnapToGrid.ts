
import { useCallback, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Point } from '@/types/core/Point';
import { snapPointToGrid, snapLineToGrid, constrainToMajorAngles } from '@/utils/grid/snapping';

export interface UseEnhancedSnapToGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialSnapEnabled?: boolean;
  gridSize?: number;
  autoStraighten?: boolean;
}

export const useEnhancedSnapToGrid = ({
  fabricCanvasRef,
  initialSnapEnabled = true,
  gridSize = GRID_CONSTANTS.GRID_SIZE,
  autoStraighten = true
}: UseEnhancedSnapToGridProps) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [straightenEnabled, setStraightenEnabled] = useState(autoStraighten);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle auto-straighten lines
  const toggleStraighten = useCallback(() => {
    setStraightenEnabled(prev => !prev);
  }, []);
  
  // Enhanced snap point function that also considers auto-straightening
  const snapPoint = useCallback((point: Point, origin?: Point): Point => {
    if (!snapEnabled) return { ...point };
    
    // First, snap to grid
    const snappedPoint = snapPointToGrid(point, gridSize);
    
    // If auto-straighten is enabled and we have an origin point, constrain to major angles
    if (straightenEnabled && origin) {
      const { end } = constrainToMajorAngles(origin, snappedPoint);
      return end;
    }
    
    return snappedPoint;
  }, [snapEnabled, straightenEnabled, gridSize]);
  
  // Enhanced snap line function
  const snapLine = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    
    // First, snap both points to grid
    const snappedStart = snapPointToGrid(start, gridSize);
    let snappedEnd = snapPointToGrid(end, gridSize);
    
    // If auto-straighten is enabled, constrain to major angles
    if (straightenEnabled) {
      const constrained = constrainToMajorAngles(snappedStart, snappedEnd);
      snappedEnd = constrained.end;
    }
    
    return { start: snappedStart, end: snappedEnd };
  }, [snapEnabled, straightenEnabled, gridSize]);
  
  // Snap during mouse or touch events
  const snapEventPoint = useCallback((e: any): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      const pointer = canvas.getPointer(e);
      return snapPoint({ x: pointer.x, y: pointer.y });
    } catch (error) {
      console.error('Error getting pointer position:', error);
      return null;
    }
  }, [fabricCanvasRef, snapPoint]);
  
  return {
    snapEnabled,
    straightenEnabled,
    toggleSnapToGrid,
    toggleStraighten,
    snapPoint,
    snapLine,
    snapEventPoint
  };
};
