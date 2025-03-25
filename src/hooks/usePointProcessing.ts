/**
 * Custom hook for processing points based on the drawing tool
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { PIXELS_PER_METER, type Point as GeneralPoint } from "@/utils/drawing";
import { metersToPixels } from "@/utils/geometry";

interface UsePointProcessingResult {
  processPoints: (points: Point[]) => Point[];
  convertToPixelPoints: (points: Point[]) => Point[];
  isShapeClosed: (points: Point[]) => boolean;
}

/**
 * Hook for processing points based on the drawing tool
 * @param {DrawingTool} tool - The current drawing tool
 * @param {string} lineColor - The current line color
 * @returns {UsePointProcessingResult} Point processing functions
 */
export const usePointProcessing = (tool: DrawingTool, lineColor: string): UsePointProcessingResult => {
  /**
   * Process points based on the drawing tool
   * @param {Point[]} points - The points to process
   * @returns {Point[]} The processed points
   */
  const processPoints = useCallback((points: Point[]): Point[] => {
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
   * @param {Point[]} points - The points of the shape
   * @returns {boolean} True if the shape is closed, false otherwise
   */
  const isShapeClosed = useCallback((points: Point[]): boolean => {
    if (points.length < 3) {
      return false;
    }

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const distanceThreshold = 0.1; // 10cm threshold

    const dx = lastPoint.x - firstPoint.x;
    const dy = lastPoint.y - firstPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= distanceThreshold;
  }, []);

  return { processPoints, convertToPixelPoints, isShapeClosed };
};
