
/**
 * Grid alignment hook for straight line tool
 * Handles snapping lines to grid
 * @module hooks/straightLineTool/useGridAlignment
 */
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { Canvas } from 'fabric';

/**
 * Grid snapping settings
 */
export interface GridSnappingSettings {
  enabled: boolean;
  gridSize: number;
  threshold: number;
}

/**
 * Default grid snapping settings
 */
export const DEFAULT_GRID_SETTINGS: GridSnappingSettings = {
  enabled: true,
  gridSize: 20,
  threshold: 10
};

/**
 * Hook for handling grid alignment
 * @returns Grid snapping functions
 */
export const useGridAlignment = (settings: GridSnappingSettings = DEFAULT_GRID_SETTINGS) => {
  /**
   * Snap a point to the nearest grid intersection
   * @param point Point to snap
   * @returns Snapped point
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!settings.enabled) return point;
    
    const { gridSize } = settings;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [settings]);
  
  /**
   * Force a line to be horizontal or vertical if close to alignment
   * @param startPoint Line start point
   * @param endPoint Line end point
   * @returns Corrected end point
   */
  const autoStraighten = useCallback((startPoint: Point, endPoint: Point): Point => {
    if (!settings.enabled) return endPoint;
    
    const { threshold } = settings;
    
    const dx = Math.abs(endPoint.x - startPoint.x);
    const dy = Math.abs(endPoint.y - startPoint.y);
    
    // Force horizontal if y difference is small
    if (dy < threshold && dx > threshold) {
      return { x: endPoint.x, y: startPoint.y };
    }
    
    // Force vertical if x difference is small
    if (dx < threshold && dy > threshold) {
      return { x: startPoint.x, y: endPoint.y };
    }
    
    return endPoint;
  }, [settings]);
  
  return {
    snapToGrid,
    autoStraighten
  };
};
