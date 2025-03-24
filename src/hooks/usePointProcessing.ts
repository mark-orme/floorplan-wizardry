
/**
 * Custom hook for processing points during drawing
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { 
  type Point,
  PIXELS_PER_METER,
  GRID_SIZE
} from "@/utils/drawing";
import { 
  snapToGrid, 
  snapPointsToGrid,
  straightenStroke,
  filterRedundantPoints,
  calculateDistance,
  isExactGridMultiple,
  forceGridAlignment,
  snapToNearestGridLine,
  pixelsToMeters,
  metersToPixels
} from "@/utils/geometry";
import { DrawingTool } from "./useCanvasState";
import { PathProcessingCallbacks } from "@/types/drawingTypes";

/**
 * Hook for processing points during drawing operations
 * @param tool - The current drawing tool
 * @returns Point processing utilities
 */
export const usePointProcessing = (tool: DrawingTool): PathProcessingCallbacks => {
  
  /**
   * Process and optimize points based on the current drawing tool
   * IMPROVED: Ensures walls strictly snap to grid lines with proper unit handling
   */
  const processPoints = useCallback((points: Point[]): Point[] => {
    if (points.length < 2) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Not enough points to process");
      }
      return points;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Processing points:", points);
      console.log("Current tool:", tool);
    }
    
    // Filter out redundant points that are too close together
    let filteredPoints = filterRedundantPoints(points, 0.05);
    
    // If we have too few points after filtering, use original points
    if (filteredPoints.length < 2) {
      filteredPoints = points;
    }
    
    // For wall tool, use EXACT grid alignment for both start and end points
    let finalPoints: Point[];
    if (tool === 'straightLine') {
      // CRITICAL FIX: Force wall endpoints to align EXACTLY to grid lines
      // This is the key fix for ensuring walls always start and end on grid
      const startPoint = snapToGrid(filteredPoints[0]);
      const endPoint = snapToGrid(filteredPoints[filteredPoints.length - 1]);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("STRICT WALL SNAP - Unit handling:");
        console.log("- Original start (meters):", filteredPoints[0]);
        console.log("- Snapped to grid (meters):", startPoint);
        console.log("- Original end (meters):", filteredPoints[filteredPoints.length - 1]);
        console.log("- Snapped to grid (meters):", endPoint);
      }
      
      // Create a perfectly straight line with exact grid alignment
      finalPoints = straightenStroke([startPoint, endPoint]);
      
      // Final validation: Ensure both points are exactly on grid lines - applying snapToGrid twice
      // to guarantee perfect alignment
      finalPoints = finalPoints.map(point => snapToGrid(point));
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Final wall points (after processing):", finalPoints);
        
        // Debug visualization of wall endpoints (in meters)
        console.log(`Final wall from (${finalPoints[0].x}m, ${finalPoints[0].y}m) to (${finalPoints[1].x}m, ${finalPoints[1].y}m)`);
      }
    } else {
      // Regular snapping for other tools
      finalPoints = snapPointsToGrid(filteredPoints);
    }
    
    // Calculate and display exact wall length
    if (tool === 'straightLine' && finalPoints.length >= 2) {
      const lengthInMeters = calculateDistance(finalPoints[0], finalPoints[1]);
      const displayLength = lengthInMeters.toFixed(1);
      toast.success(`Wall length: ${displayLength}m`);
      
      if (process.env.NODE_ENV === 'development') {
        // Log the exact wall length for debugging
        console.log(`Wall length: ${lengthInMeters}m (using GRID_SIZE: ${GRID_SIZE}m)`);
      }
    }
    
    // Make sure we still have at least 2 points after all processing
    if (finalPoints.length < 2) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Not enough points after processing");
      }
      return points; // Return original points if processing failed
    }
    
    return finalPoints;
  }, [tool]);
  
  /**
   * Convert meter points to pixel points for display
   * Properly accounts for zoom level
   */
  const convertToPixelPoints = useCallback((meterPoints: Point[], zoom: number = 1): Point[] => {
    return meterPoints.map(point => metersToPixels(point, zoom));
  }, []);
  
  /**
   * Convert pixel points to meter points for processing
   * Properly accounts for zoom level
   */
  const convertToMeterPoints = useCallback((pixelPoints: Point[], zoom: number = 1): Point[] => {
    return pixelPoints.map(point => pixelsToMeters(point, zoom));
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
    const distanceX = Math.abs(lastPoint.x - firstPoint.x);
    const distanceY = Math.abs(lastPoint.y - firstPoint.y);
    
    return distanceX < distanceThreshold && distanceY < distanceThreshold;
  }, []);
  
  return { 
    processPoints, 
    convertToPixelPoints, 
    convertToMeterPoints,
    isShapeClosed 
  };
};
