
/**
 * Custom hook for grid snapping functionality
 * @module useSnapToGrid
 */
import { useState, useCallback } from 'react';
import { Point } from '@/types';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Result type for the useSnapToGrid hook
 */
export interface UseSnapToGridResult {
  /** Whether snap to grid is enabled */
  snapEnabled: boolean;
  /** Toggle snap to grid */
  toggleSnap: () => void;
  /** Snap a point to the grid */
  snapPointToGrid: (point: Point) => Point;
  /** Snap a line to the grid */
  snapLineToGrid: (start: Point, end: Point) => { start: Point; end: Point };
  /** Check if a point is snapped to grid */
  isSnappedToGrid: (point: Point) => boolean;
  /** Whether auto-straightening is enabled */
  isAutoStraightened: boolean;
}

/**
 * Hook for handling grid snapping functionality
 * @returns Snap to grid utilities
 */
export function useSnapToGrid(): UseSnapToGridResult {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isAutoStraightened, setIsAutoStraightened] = useState(false);

  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  /**
   * Snap a point to the grid
   * @param point - Point to snap
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    // Round to nearest grid point
    const snapX = Math.round(point.x / GRID_SPACING) * GRID_SPACING;
    const snapY = Math.round(point.y / GRID_SPACING) * GRID_SPACING;
    
    return { x: snapX, y: snapY };
  }, [snapEnabled]);

  /**
   * Check if a point is already snapped to grid
   * @param point - Point to check
   * @returns Whether the point is snapped to grid
   */
  const isSnappedToGrid = useCallback((point: Point): boolean => {
    if (!snapEnabled) return false;
    
    const snapX = Math.round(point.x / GRID_SPACING) * GRID_SPACING;
    const snapY = Math.round(point.y / GRID_SPACING) * GRID_SPACING;
    
    return Math.abs(point.x - snapX) <= SNAP_THRESHOLD && 
           Math.abs(point.y - snapY) <= SNAP_THRESHOLD;
  }, [snapEnabled]);

  /**
   * Snap a line to the grid
   * @param start - Start point
   * @param end - End point
   * @returns Snapped start and end points
   */
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start, end };
    
    const snappedStart = snapPointToGrid(start);
    const snappedEnd = snapPointToGrid(end);
    
    return { start: snappedStart, end: snappedEnd };
  }, [snapEnabled, snapPointToGrid]);

  return {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    isAutoStraightened
  };
}
