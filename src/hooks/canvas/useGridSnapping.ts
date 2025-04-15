
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';
import { Point } from '@/types/core/Point';
import { snapPointToGrid, snapLineToGrid as snapLineToGridUtil } from '@/utils/grid/snapping';

interface UseGridSnappingProps {
  initialSnapEnabled?: boolean;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  defaultGridSize?: number;
}

export const useGridSnapping = ({
  initialSnapEnabled = true,
  fabricCanvasRef,
  defaultGridSize = GRID_SPACING.SMALL
}: UseGridSnappingProps) => {
  // State for snapping
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Snap a point to grid
  const snapPointToGridHandler = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    
    return snapPointToGrid(point, defaultGridSize);
  }, [snapEnabled, defaultGridSize]);
  
  // Snap a line to grid (handle start and end points)
  const snapLineToGridHandler = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    
    return snapLineToGridUtil(start, end, defaultGridSize);
  }, [snapEnabled, defaultGridSize]);
  
  return {
    snapEnabled,
    toggleSnapToGrid,
    snapPointToGrid: snapPointToGridHandler,
    snapLineToGrid: snapLineToGridHandler
  };
};
