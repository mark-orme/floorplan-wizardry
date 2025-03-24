
/**
 * Custom hook for processing points during drawing
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { 
  type Point,
  PIXELS_PER_METER
} from "@/utils/drawing";
import { 
  snapToGrid, 
  snapPointsToGrid,
  straightenStroke,
  filterRedundantPoints,
  calculateDistance,
  isExactGridMultiple,
  forceGridAlignment,
  snapToNearestGridLine
} from "@/utils/geometry";
import { DrawingTool } from "./useCanvasState";

export const usePointProcessing = (tool: DrawingTool) => {
  
  /**
   * Process and optimize points based on the current drawing tool
   */
  const processPoints = useCallback((points: Point[]): Point[] => {
    if (points.length < 2) {
      console.error("Not enough points to process");
      return points;
    }
    
    // Filter out redundant points that are too close together
    let filteredPoints = filterRedundantPoints(points, 0.05);
    
    // If we have too few points after filtering, use original points
    if (filteredPoints.length < 2) {
      filteredPoints = points;
    }
    
    // For wall tool, use strict grid alignment for both start and end points
    let finalPoints;
    if (tool === 'straightLine') {
      // IMPROVED: Force all wall points to snap EXACTLY to nearest grid lines
      const startPoint = snapToNearestGridLine(filteredPoints[0]);
      const endPoint = snapToNearestGridLine(filteredPoints[filteredPoints.length - 1]);
      
      // Create a perfectly straight line with exact grid alignment
      finalPoints = straightenStroke([startPoint, endPoint]);
      
      console.log("Applied strict wall alignment. Original:", [filteredPoints[0], filteredPoints[filteredPoints.length - 1]], "Aligned:", finalPoints);
      
      // Triple-check grid alignment and force exact alignment if needed
      const startIsAligned = isExactGridMultiple(finalPoints[0].x) && isExactGridMultiple(finalPoints[0].y);
      const endIsAligned = isExactGridMultiple(finalPoints[1].x) && isExactGridMultiple(finalPoints[1].y);
      
      if (!startIsAligned || !endIsAligned) {
        console.warn("Wall endpoints not exactly on grid. Forcing alignment");
        finalPoints = [
          {
            x: Math.round(finalPoints[0].x * 10) / 10,
            y: Math.round(finalPoints[0].y * 10) / 10
          },
          {
            x: Math.round(finalPoints[1].x * 10) / 10,
            y: Math.round(finalPoints[1].y * 10) / 10
          }
        ];
      }
    } else {
      // Regular snapping for other tools
      finalPoints = snapToGrid(filteredPoints);
    }
    
    // Calculate and display exact wall length to exactly 1 decimal place
    if (tool === 'straightLine' && finalPoints.length >= 2) {
      const lengthInMeters = calculateDistance(finalPoints[0], finalPoints[1]);
      
      // Display with exactly 1 decimal place for consistency
      const displayLength = lengthInMeters.toFixed(1);
      toast.success(`Wall length: ${displayLength}m`);
    }
    
    // Make sure we still have at least 2 points after all processing
    if (finalPoints.length < 2) {
      console.error("Not enough points after processing");
      return points; // Return original points if processing failed
    }
    
    return finalPoints;
  }, [tool]);
  
  /**
   * Convert meter points to pixel points for display
   */
  const convertToPixelPoints = useCallback((meterPoints: Point[]): Point[] => {
    return meterPoints.map(p => ({ 
      x: p.x * PIXELS_PER_METER, 
      y: p.y * PIXELS_PER_METER 
    }));
  }, []);
  
  /**
   * Check if a shape is closed (first and last points are close enough)
   */
  const isShapeClosed = useCallback((points: Point[]): boolean => {
    if (points.length < 3) return false;
    
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    
    // Check if first and last points are close enough (within 0.05m)
    const distanceThreshold = 0.05;
    const dx = Math.abs(lastPoint.x - firstPoint.x);
    const dy = Math.abs(lastPoint.y - firstPoint.y);
    
    return dx < distanceThreshold && dy < distanceThreshold;
  }, []);
  
  return { processPoints, convertToPixelPoints, isShapeClosed };
};
