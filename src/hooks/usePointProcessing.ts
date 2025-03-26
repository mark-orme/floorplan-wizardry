/**
 * Custom hook for processing points based on the drawing tool
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Point } from "@/types/drawingTypes";
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { PIXELS_PER_METER } from "@/utils/drawing";
import { SHAPE_CLOSE_THRESHOLD } from "@/utils/geometry/constants";
import { snapLineToStandardAngles } from "@/utils/grid/snapping";
import { calculateDistance } from "@/utils/geometry/lineOperations";
import logger from "@/utils/logger";

/**
 * Interface for usePointProcessing props
 */
export interface UsePointProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  tool?: DrawingTool; // Made optional to allow it to work with useDrawingState's simplified call
}

/**
 * Interface defining the return value of usePointProcessing hook
 * @interface UsePointProcessingResult
 */
interface UsePointProcessingResult {
  /**
   * Process path points to extract standardized points
   * @param {FabricPath} path - The fabric path to process
   * @param {boolean} closeShape - Whether to close the shape
   * @returns {Object} Processed points in different formats
   */
  processPathPoints: (path: FabricPath, closeShape?: boolean) => {
    finalPoints: Point[];
    pixelPoints: Point[];
  };
  
  /**
   * Process points based on the current drawing tool
   * @param {Point[]} points - The points to process
   * @returns {Point[]} Processed points
   */
  processPoints: (points: Point[]) => Point[];
  
  /**
   * Convert meter coordinates to pixel coordinates
   * @param {Point[]} points - Points in meter coordinates
   * @returns {Point[]} Points in pixel coordinates
   */
  convertToPixelPoints: (points: Point[]) => Point[];
  
  /**
   * Check if a shape is closed (first and last points are close)
   * @param {Point[]} points - The points to check
   * @returns {boolean} True if the shape is closed
   */
  isShapeClosed: (points: Point[]) => boolean;
  
  /**
   * Snap points based on the current tool and context
   * @param {Point} startPoint - The starting point
   * @param {Point} currentPoint - The current point
   * @returns {Point} The snapped current point
   */
  snapCurrentPoint: (startPoint: Point, currentPoint: Point) => Point;
}

/**
 * Hook for processing points based on the drawing tool
 * Provides utility functions for point conversion and shape analysis
 * 
 * @param {UsePointProcessingProps} props - Hook properties
 * @returns {UsePointProcessingResult} Point processing functions
 */
export const usePointProcessing = (
  props: UsePointProcessingProps
): UsePointProcessingResult => {
  const { fabricCanvasRef, gridLayerRef, tool } = props;
  
  /**
   * Process points extracted from a fabric path
   * @param {FabricPath} path - The fabric path to process
   * @param {boolean} closeShape - Whether to close the shape
   * @returns {Object} Processed points in different formats
   */
  const processPathPoints = useCallback((path: FabricPath, closeShape: boolean = false) => {
    // Extract points from the path
    // This is a simplified implementation - actual path parsing would be more complex
    const points: Point[] = [];
    
    // Extract points from path segments
    // In a real implementation, you would parse the path.path array
    
    // For now, let's use path's left, top, width, height as approximation
    if (path) {
      points.push({ x: path.left || 0, y: path.top || 0 });
      points.push({ x: (path.left || 0) + (path.width || 0), y: (path.top || 0) + (path.height || 0) });
    }
    
    // Process the points based on current tool
    const processedPoints = processPoints(points);
    
    // Convert points from pixel to meter coordinates
    const finalPoints = processedPoints.map(point => ({
      x: point.x / PIXELS_PER_METER,
      y: point.y / PIXELS_PER_METER
    }));
    
    // Close the shape if requested
    if (closeShape && finalPoints.length > 2 && !isShapeClosed(finalPoints)) {
      finalPoints.push({ ...finalPoints[0] });
    }
    
    // Return both final meter points and original pixel points
    return {
      finalPoints,
      pixelPoints: processedPoints
    };
  }, []);
  
  /**
   * Process points based on the drawing tool
   * Applies tool-specific transformations to points
   * 
   * @param {Point[]} points - The points to process
   * @returns {Point[]} The processed points
   */
  const processPoints = useCallback((points: Point[]): Point[] => {
    logger.debug(`Processing ${points.length} points`);
    
    if (points.length < 2) return points;
    
    // For now, we'll just return the points as is
    // In a real implementation, we would process based on the tool
    return points;
  }, []);

  /**
   * Snap the current point based on the tool and context
   * Used during active drawing to guide the user
   * 
   * @param {Point} startPoint - The start point of the current drawing
   * @param {Point} currentPoint - The current mouse position
   * @returns {Point} The snapped current point
   */
  const snapCurrentPoint = useCallback((startPoint: Point, currentPoint: Point): Point => {
    if (!startPoint || !currentPoint) return currentPoint;
    
    // Apply angle snapping for lines
    return snapLineToStandardAngles(startPoint, currentPoint);
  }, []);

  /**
   * Convert meter coordinates to pixel coordinates for display
   * Applies the PIXELS_PER_METER conversion factor
   * 
   * @param {Point[]} points - The points in meter coordinates
   * @returns {Point[]} The points in pixel coordinates
   */
  const convertToPixelPoints = useCallback((points: Point[]): Point[] => {
    return points.map(point => ({
      x: point.x * PIXELS_PER_METER,
      y: point.y * PIXELS_PER_METER
    }));
  }, []);

  /**
   * Check if the shape is closed (first and last points are very close)
   * Used for determining if a shape can be filled or measured
   * 
   * @param {Point[]} points - The points of the shape
   * @returns {boolean} True if the shape is closed, false otherwise
   */
  const isShapeClosed = useCallback((points: Point[]): boolean => {
    if (points.length < 3) {
      return false;
    }

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    
    // Use the constant from geometry/constants.ts
    const distanceThreshold = SHAPE_CLOSE_THRESHOLD / PIXELS_PER_METER; // Convert to meters

    const distance = calculateDistance(firstPoint, lastPoint);
    
    const isClosed = distance <= distanceThreshold;
    logger.debug(`Shape closed check: distance=${distance.toFixed(3)}m, threshold=${distanceThreshold}m, result=${isClosed}`);
    
    return isClosed;
  }, []);

  return { 
    processPathPoints,
    processPoints, 
    convertToPixelPoints, 
    isShapeClosed,
    snapCurrentPoint
  };
};
