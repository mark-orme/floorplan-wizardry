
/**
 * Hook for grid snapping operations
 * Handles snapping points and lines to grid
 * @module useSnapToGrid
 */
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point, createPoint } from '@/types/core/Point';
import { getNearestGridPoint, snapToGrid, snapLineToStandardAngles } from '@/utils/gridUtils';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Props for useSnapToGrid hook
 */
interface UseSnapToGridProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Initial snap state */
  initialSnapEnabled?: boolean;
}

/**
 * Result of useSnapToGrid hook
 */
export interface UseSnapToGridResult {
  /** Whether snapping to grid is enabled */
  snapEnabled: boolean;
  /** Toggle snapping on/off */
  toggleSnap: () => void;
  /** Enable snapping */
  enableSnap: () => void;
  /** Disable snapping */
  disableSnap: () => void;
  /** Snap a point to grid */
  snapPointToGrid: (point: Point) => Point;
  /** Snap a line to grid */
  snapLineToGrid: (startPoint: Point, endPoint: Point) => Point;
  /** Check if a point is snapped to grid */
  isSnappedToGrid: (point: Point) => boolean;
  /** Check if a line is auto-straightened */
  isAutoStraightened: (startPoint: Point, endPoint: Point, tolerance?: number) => boolean;
}

/**
 * Hook for snapping operations in canvas
 * 
 * @param {UseSnapToGridProps} props - Hook properties
 * @returns {UseSnapToGridResult} Snapping functions and state
 */
export const useSnapToGrid = ({ 
  fabricCanvasRef,
  initialSnapEnabled = true
}: UseSnapToGridProps): UseSnapToGridResult => {
  // Track whether snapping is enabled
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Toggle snapping on/off
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Enable snapping
   */
  const enableSnap = useCallback(() => {
    setSnapEnabled(true);
  }, []);
  
  /**
   * Disable snapping
   */
  const disableSnap = useCallback(() => {
    setSnapEnabled(false);
  }, []);
  
  /**
   * Snap a point to grid if snapping is enabled
   * @param {Point} point - Point to snap
   * @returns {Point} Snapped or original point
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    return getNearestGridPoint(point, GRID_SPACING.SMALL);
  }, [snapEnabled]);
  
  /**
   * Snap a line to grid if snapping is enabled
   * @param {Point} startPoint - Line start point
   * @param {Point} endPoint - Line end point
   * @returns {Point} Snapped or original end point
   */
  const snapLineToGrid = useCallback((startPoint: Point, endPoint: Point): Point => {
    if (!snapEnabled) return endPoint;
    
    // First try standard angle snapping
    const snappedEnd = snapLineToStandardAngles(startPoint, endPoint);
    
    // Then snap that point to grid
    return getNearestGridPoint(snappedEnd, GRID_SPACING.SMALL);
  }, [snapEnabled]);
  
  /**
   * Check if a point is snapped to grid
   * @param {Point} point - Point to check
   * @returns {boolean} Whether point is on a grid intersection
   */
  const isSnappedToGrid = useCallback((point: Point): boolean => {
    const snappedPoint = getNearestGridPoint(point, GRID_SPACING.SMALL);
    
    // Calculate distance between original and snapped point
    const dx = point.x - snappedPoint.x;
    const dy = point.y - snappedPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If distance is very small, point is already on grid
    return distance < SNAP_THRESHOLD / 2;
  }, []);
  
  /**
   * Check if a line is auto-straightened
   * @param {Point} startPoint - Line start point
   * @param {Point} endPoint - Line end point
   * @param {number} tolerance - Angle tolerance in degrees
   * @returns {boolean} Whether line is auto-straightened
   */
  const isAutoStraightened = useCallback((
    startPoint: Point, 
    endPoint: Point, 
    tolerance: number = 5
  ): boolean => {
    if (!snapEnabled) return false;
    
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    // Calculate angle in degrees
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Normalize angle to 0-360 range
    const normalizedAngle = (angle + 360) % 360;
    
    // Check if angle is close to 0, 45, 90, 135, 180, 225, 270, or 315 degrees
    for (let targetAngle = 0; targetAngle < 360; targetAngle += 45) {
      const diff = Math.abs(normalizedAngle - targetAngle);
      const wrappedDiff = Math.min(diff, 360 - diff);
      
      if (wrappedDiff <= tolerance) {
        return true;
      }
    }
    
    return false;
  }, [snapEnabled]);
  
  return {
    snapEnabled,
    toggleSnap,
    enableSnap,
    disableSnap,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    isAutoStraightened
  };
};
