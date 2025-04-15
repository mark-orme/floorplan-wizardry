import { useCallback, useState } from 'react';
import { GRID_SPACING } from '@/constants/numerics';
import { Point } from '@/types/core/Point';
import { snapPointToGrid, snapLineToGrid as snapLineToGridUtil } from '@/utils/grid/snapping';

export interface UseSnapToGridProps {
  /** Initial snap state */
  initialSnapEnabled?: boolean;
  /** Reference to the fabric canvas */
  fabricCanvasRef?: React.MutableRefObject<any>;
  /** Default grid size */
  defaultGridSize?: number;
  /** Whether to enforce angle constraints */
  angleConstraints?: boolean;
}

export interface UseSnapToGridResult {
  /** Whether snap to grid is enabled */
  snapEnabled: boolean;
  /** Toggle snap to grid on/off */
  toggleSnapToGrid: () => void;
  /** Snap a point to the grid */
  snapPointToGrid: (point: Point) => Point;
  /** Snap a line to the grid */
  snapLineToGrid: (start: Point, end: Point) => { start: Point, end: Point };
  /** Snap an event's coordinates to the grid */
  snapEventToGrid: (e: any) => Point | null;
  /** Check if a point is snapped to the grid */
  isSnappedToGrid: (point: Point, threshold?: number) => boolean;
}

export const useSnapToGrid = (props?: UseSnapToGridProps): UseSnapToGridResult => {
  const {
    initialSnapEnabled = true,
    fabricCanvasRef,
    defaultGridSize = GRID_SPACING.SMALL,
    angleConstraints = false
  } = props || {};
  
  // Add state for snap enabled
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  // Toggle snap to grid function
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prevState => !prevState);
  }, []);
  
  // Snap a point to the nearest grid point
  const snapPointToGridHandler = useCallback((point: Point): Point => {
    // If snapping is disabled, return the original point
    if (!snapEnabled) {
      return { ...point };
    }
    
    return snapPointToGrid(point, defaultGridSize);
  }, [snapEnabled, defaultGridSize]);
  
  // Snap a line to the grid
  const snapLineToGridHandler = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    // If snapping is disabled, return the original points
    if (!snapEnabled) {
      return { start: { ...start }, end: { ...end } };
    }
    
    return snapLineToGridUtil(start, end, defaultGridSize);
  }, [snapEnabled, defaultGridSize]);
  
  // Helper to snap event coordinates to grid
  const snapEventToGrid = useCallback((e: any): Point | null => {
    if (!fabricCanvasRef?.current) return null;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e);
    
    return snapPointToGridHandler({ x: pointer.x, y: pointer.y });
  }, [fabricCanvasRef, snapPointToGridHandler]);
  
  // Check if a point is on the grid (within a small threshold)
  const isSnappedToGrid = useCallback((point: Point, threshold: number = 0.5): boolean => {
    if (!snapEnabled) return false;
    
    // Check if the point's coordinates are close to multiples of the grid size
    const xOnGrid = Math.abs(point.x % defaultGridSize) < threshold || 
                    Math.abs(point.x % defaultGridSize - defaultGridSize) < threshold;
    const yOnGrid = Math.abs(point.y % defaultGridSize) < threshold || 
                    Math.abs(point.y % defaultGridSize - defaultGridSize) < threshold;
    
    return xOnGrid && yOnGrid;
  }, [snapEnabled, defaultGridSize]);
  
  return {
    snapEnabled,
    toggleSnapToGrid,
    snapPointToGrid: snapPointToGridHandler,
    snapLineToGrid: snapLineToGridHandler,
    snapEventToGrid,
    isSnappedToGrid
  };
};
