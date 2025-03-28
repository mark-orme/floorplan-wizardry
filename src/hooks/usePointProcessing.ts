
/**
 * Hook for point processing operations
 * Handles point transformation, validation, and processing
 * @module usePointProcessing
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point, createPoint } from '@/types/core/Point';
import { getNearestGridPoint } from '@/utils/gridUtils';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Props for usePointProcessing hook
 */
interface UsePointProcessingProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Result of usePointProcessing hook
 */
export interface UsePointProcessingResult {
  /** Process a point with transformations */
  processPoint: (point: Point) => Point;
  /** Validate a point is within canvas bounds */
  validatePoint: (point: Point) => boolean;
  /** Convert screen coordinates to canvas coordinates */
  screenToCanvasPoint: (x: number, y: number) => Point;
  /** Convert canvas coordinates to screen coordinates */
  canvasToScreenPoint: (point: Point) => Point;
}

/**
 * Hook for processing points in canvas operations
 * 
 * @param {UsePointProcessingProps} props - Hook properties
 * @returns {UsePointProcessingResult} Point processing functions
 */
export const usePointProcessing = ({ 
  fabricCanvasRef 
}: UsePointProcessingProps): UsePointProcessingResult => {
  
  /**
   * Process a point with any needed transformations
   * @param {Point} point - Point to process
   * @returns {Point} Processed point
   */
  const processPoint = useCallback((point: Point): Point => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return point;
    
    // Apply any transformations (zoom, pan, etc.)
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    
    if (!vpt) return point;
    
    // Create a new point to avoid mutating the original
    return createPoint(point.x, point.y);
  }, [fabricCanvasRef]);
  
  /**
   * Validate a point is within canvas bounds
   * @param {Point} point - Point to validate
   * @returns {boolean} Whether point is valid
   */
  const validatePoint = useCallback((point: Point): boolean => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    const width = canvas.width || 0;
    const height = canvas.height || 0;
    
    return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
  }, [fabricCanvasRef]);
  
  /**
   * Convert screen coordinates to canvas coordinates
   * @param {number} x - Screen X coordinate
   * @param {number} y - Screen Y coordinate
   * @returns {Point} Canvas coordinates
   */
  const screenToCanvasPoint = useCallback((x: number, y: number): Point => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return createPoint(x, y);
    
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    
    if (!vpt) return createPoint(x, y);
    
    // Transform point from screen to canvas coordinates
    return createPoint(
      (x - vpt[4]) / zoom,
      (y - vpt[5]) / zoom
    );
  }, [fabricCanvasRef]);
  
  /**
   * Convert canvas coordinates to screen coordinates
   * @param {Point} point - Canvas coordinates
   * @returns {Point} Screen coordinates
   */
  const canvasToScreenPoint = useCallback((point: Point): Point => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return point;
    
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    
    if (!vpt) return point;
    
    // Transform point from canvas to screen coordinates
    return createPoint(
      point.x * zoom + vpt[4],
      point.y * zoom + vpt[5]
    );
  }, [fabricCanvasRef]);
  
  return {
    processPoint,
    validatePoint,
    screenToCanvasPoint,
    canvasToScreenPoint
  };
};
