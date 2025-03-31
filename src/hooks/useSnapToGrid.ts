/**
 * Hook for managing grid snapping functionality
 * @module hooks/useSnapToGrid
 */
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Geometry';
import { DrawingMode } from '@/constants/drawingModes';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Props interface for useSnapToGrid hook
 * @interface UseSnapToGridProps
 */
export interface UseSnapToGridProps {
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Line constraints for grid snapping
 * @interface LineConstraints
 */
interface LineConstraints {
  start: Point;
  end: Point;
  isHorizontal?: boolean;
  isVertical?: boolean;
  isDiagonal?: boolean;
}

/**
 * Hook for grid snapping functionality
 * 
 * @param {UseSnapToGridProps} props - Optional props including canvas reference
 * @returns Object with snapping functions and state
 */
export const useSnapToGrid = (props?: UseSnapToGridProps) => {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const { fabricCanvasRef } = props || {};

  /**
   * Snap a point to the grid
   * @param point - Point to snap
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;

    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    const x = Math.round(point.x / gridSize) * gridSize;
    const y = Math.round(point.y / gridSize) * gridSize;

    return { x, y };
  }, [snapEnabled]);

  /**
   * Snap a line to the grid, applying constraints
   * @param start - Start point of the line
   * @param end - End point of the line
   * @returns Object with snapped end point and constraint flags
   */
  const snapLineToGrid = useCallback((start: Point, end: Point): LineConstraints => {
    if (!snapEnabled) {
      return { start, end };
    }

    const snappedStart = snapPointToGrid(start);
    const snappedEnd = snapPointToGrid(end);

    let isHorizontal = false;
    let isVertical = false;
    let isDiagonal = false;

    // Check for horizontal constraint
    if (Math.abs(snappedEnd.y - snappedStart.y) <= GRID_CONSTANTS.SMALL_GRID_SIZE / 2) {
      snappedEnd.y = snappedStart.y;
      isHorizontal = true;
    }
    // Check for vertical constraint
    else if (Math.abs(snappedEnd.x - snappedStart.x) <= GRID_CONSTANTS.SMALL_GRID_SIZE / 2) {
      snappedEnd.x = snappedStart.x;
      isVertical = true;
    }
    // Check for diagonal constraint (45-degree angle)
    else if (Math.abs(snappedEnd.x - snappedStart.x) === Math.abs(snappedEnd.y - snappedStart.y)) {
      isDiagonal = true;
    }

    return {
      start: snappedStart,
      end: snappedEnd,
      isHorizontal,
      isVertical,
      isDiagonal
    };
  }, [snapEnabled, snapPointToGrid]);

  /**
   * Check if a point is snapped to the grid
   * @param point - Point to check
   * @returns Whether the point is snapped to the grid
   */
  const isSnappedToGrid = useCallback((point: Point): boolean => {
    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    return point.x % gridSize === 0 && point.y % gridSize === 0;
  }, []);
  
  return {
    snapEnabled,
    setSnapEnabled,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    toggleSnapToGrid: () => setSnapEnabled(prev => !prev),
    getSnapEnabledForTool: (tool: DrawingMode) => snapEnabled
  };
};
