
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
  /** Reference to Fabric.js canvas */
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Line constraints for grid snapping
 * @interface LineConstraints
 */
export interface LineConstraints {
  start: Point;
  end: Point;
  isHorizontal?: boolean;
  isVertical?: boolean;
  isDiagonal?: boolean;
  isAutoStraightened?: boolean;
}

/**
 * Hook for grid snapping functionality
 * 
 * @param {UseSnapToGridProps} props - Optional props including canvas reference
 * @returns Object with snapping functions and state
 */
export const useSnapToGrid = (props?: UseSnapToGridProps) => {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [autoStraighten, setAutoStraighten] = useState(true);
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
    let isAutoStraightened = false;

    // Only auto-straighten if that feature is enabled
    if (autoStraighten) {
      // Check for horizontal constraint
      if (Math.abs(snappedEnd.y - snappedStart.y) <= GRID_CONSTANTS.SMALL_GRID_SIZE / 2) {
        snappedEnd.y = snappedStart.y;
        isHorizontal = true;
        isAutoStraightened = true;
      }
      // Check for vertical constraint
      else if (Math.abs(snappedEnd.x - snappedStart.x) <= GRID_CONSTANTS.SMALL_GRID_SIZE / 2) {
        snappedEnd.x = snappedStart.x;
        isVertical = true;
        isAutoStraightened = true;
      }
      // Check for diagonal constraint (45-degree angle)
      else if (Math.abs(Math.abs(snappedEnd.x - snappedStart.x) - Math.abs(snappedEnd.y - snappedStart.y)) <= GRID_CONSTANTS.SMALL_GRID_SIZE / 2) {
        // Make the diagonal precisely 45 degrees
        const dx = Math.abs(snappedEnd.x - snappedStart.x);
        const dy = Math.abs(snappedEnd.y - snappedStart.y);
        const delta = (dx + dy) / 2;
        
        if (snappedEnd.x > snappedStart.x) {
          snappedEnd.x = snappedStart.x + delta;
        } else {
          snappedEnd.x = snappedStart.x - delta;
        }
        
        if (snappedEnd.y > snappedStart.y) {
          snappedEnd.y = snappedStart.y + delta;
        } else {
          snappedEnd.y = snappedStart.y - delta;
        }
        
        isDiagonal = true;
        isAutoStraightened = true;
      }
    }

    return {
      start: snappedStart,
      end: snappedEnd,
      isHorizontal,
      isVertical,
      isDiagonal,
      isAutoStraightened
    };
  }, [snapEnabled, autoStraighten, snapPointToGrid]);

  /**
   * Check if a point is snapped to the grid
   * @param point - Point to check
   * @returns Whether the point is snapped to the grid
   */
  const isSnappedToGrid = useCallback((point: Point): boolean => {
    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    return point.x % gridSize === 0 && point.y % gridSize === 0;
  }, []);
  
  /**
   * Get snap enabled state based on tool
   * @param tool - Current drawing tool
   * @returns Whether snapping is enabled for this tool
   */
  const getSnapEnabledForTool = useCallback((tool: DrawingMode): boolean => {
    // We could customize snap behavior per tool here
    return snapEnabled;
  }, [snapEnabled]);

  /**
   * Toggle auto-straightening of lines
   */
  const toggleAutoStraighten = useCallback(() => {
    setAutoStraighten(prev => !prev);
  }, []);
  
  return {
    snapEnabled,
    setSnapEnabled,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    toggleSnapToGrid: useCallback(() => setSnapEnabled(prev => !prev), []),
    getSnapEnabledForTool,
    isAutoStraightened: autoStraighten,
    toggleAutoStraighten
  };
};
