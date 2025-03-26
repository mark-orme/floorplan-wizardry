
/**
 * Custom hook for processing points based on the drawing tool
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { PIXELS_PER_METER } from "@/utils/drawing";
import { SHAPE_CLOSE_THRESHOLD } from "@/utils/geometry/constants";
import logger from "@/utils/logger";

/**
 * Interface defining the return value of usePointProcessing hook
 * @interface UsePointProcessingResult
 */
interface UsePointProcessingResult {
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
}

/**
 * Hook for processing points based on the drawing tool
 * Provides utility functions for point conversion and shape analysis
 * 
 * @param {DrawingTool} tool - The current drawing tool
 * @param {string} lineColor - The current line color
 * @returns {UsePointProcessingResult} Point processing functions
 */
export const usePointProcessing = (tool: DrawingTool, lineColor: string): UsePointProcessingResult => {
  /**
   * Process points based on the drawing tool
   * Applies tool-specific transformations to points
   * 
   * @param {Point[]} points - The points to process
   * @returns {Point[]} The processed points
   */
  const processPoints = useCallback((points: Point[]): Point[] => {
    logger.debug(`Processing ${points.length} points with tool: ${tool}`);
    switch (tool) {
      case "draw":
      case "straightLine":
      case "room":
        return points;
      default:
        return points;
    }
  }, [tool]);

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
    const distanceThreshold = SHAPE_CLOSE_THRESHOLD;

    const dx = lastPoint.x - firstPoint.x;
    const dy = lastPoint.y - firstPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const isClosed = distance <= distanceThreshold;
    logger.debug(`Shape closed check: distance=${distance.toFixed(3)}m, threshold=${distanceThreshold}m, result=${isClosed}`);
    
    return isClosed;
  }, []);

  return { processPoints, convertToPixelPoints, isShapeClosed };
};
