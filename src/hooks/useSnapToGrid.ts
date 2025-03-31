
/**
 * Hook for grid snapping functionality
 * Provides utilities for snapping points and lines to a grid
 * @module hooks/useSnapToGrid
 */
import { useState, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point, Line } from '@/types/core/Geometry';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Result type for the useSnapToGrid hook
 */
export interface UseSnapToGridResult {
  /** Whether snap-to-grid is enabled */
  snapEnabled: boolean;
  /** Whether auto-straightening is enabled */
  isAutoStraightened: boolean;
  /** Toggle the snap-to-grid feature */
  toggleSnap: () => void;
  /** Toggle the auto-straightening feature */
  toggleAutoStraighten: () => void;
  /** Snap a point to the nearest grid point */
  snapPointToGrid: (point: Point) => Point;
  /** Snap a line to the grid and apply auto-straightening if enabled */
  snapLineToGrid: (startPoint: Point, endPoint: Point) => Line;
  /** Check if a point is already on the grid */
  isSnappedToGrid: (point: Point) => boolean;
}

/**
 * Hook for managing grid snapping functionality
 * 
 * @param fabricCanvasRef - Optional reference to the Fabric.js canvas
 * @returns Snap-to-grid utilities and state
 */
export function useSnapToGrid(
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>
): UseSnapToGridResult {
  // State for snap toggle
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isAutoStraightened, setIsAutoStraightened] = useState(false);
  
  // Constants for grid snapping
  const gridSize = useMemo(() => GRID_CONSTANTS.SMALL_GRID_SIZE, []);
  const snapThreshold = useMemo(() => gridSize / 3, [gridSize]);
  
  /**
   * Toggle the snap-to-grid feature
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Toggle the auto-straightening feature
   */
  const toggleAutoStraighten = useCallback(() => {
    setIsAutoStraightened(prev => !prev);
  }, []);
  
  /**
   * Determine if a point is already snapped to the grid
   * 
   * @param point - The point to check
   * @returns Whether the point is on a grid point
   */
  const isSnappedToGrid = useCallback((point: Point): boolean => {
    if (!snapEnabled) return false;
    
    const isXOnGrid = Math.abs(Math.round(point.x / gridSize) * gridSize - point.x) < snapThreshold;
    const isYOnGrid = Math.abs(Math.round(point.y / gridSize) * gridSize - point.y) < snapThreshold;
    
    return isXOnGrid && isYOnGrid;
  }, [snapEnabled, gridSize, snapThreshold]);
  
  /**
   * Snap a point to the nearest grid point if snap is enabled
   * 
   * @param point - The point to snap
   * @returns The snapped point or original point if snap is disabled
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize]);
  
  /**
   * Snap a line to the grid and apply auto-straightening if enabled
   * 
   * @param startPoint - The starting point of the line
   * @param endPoint - The ending point of the line
   * @returns The snapped line
   */
  const snapLineToGrid = useCallback((startPoint: Point, endPoint: Point): Line => {
    const start = snapPointToGrid(startPoint);
    let end = snapPointToGrid(endPoint);
    
    // Apply auto-straightening logic if enabled
    if (isAutoStraightened) {
      const dx = Math.abs(end.x - start.x);
      const dy = Math.abs(end.y - start.y);
      
      // Horizontal, vertical, or 45-degree diagonal lines
      if (dx > dy * 2) {
        // Horizontal line
        end = { ...end, y: start.y };
      } else if (dy > dx * 2) {
        // Vertical line
        end = { ...end, x: start.x };
      } else if (Math.abs(dx - dy) < gridSize) {
        // 45-degree diagonal line
        const avg = (dx + dy) / 2;
        if (end.x > start.x) {
          end.x = start.x + avg;
        } else {
          end.x = start.x - avg;
        }
        
        if (end.y > start.y) {
          end.y = start.y + avg;
        } else {
          end.y = start.y - avg;
        }
      }
    }
    
    return {
      start,
      end
    };
  }, [snapPointToGrid, isAutoStraightened, gridSize]);
  
  return {
    snapEnabled,
    isAutoStraightened,
    toggleSnap,
    toggleAutoStraighten,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid
  };
}
