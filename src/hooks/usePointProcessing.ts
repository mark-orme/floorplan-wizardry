
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
  isExactGridMultiple
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
    
    // IMPORTANT: Always use strict grid snapping for all tools
    // This ensures lines always start/end exactly on grid points
    let finalPoints = snapPointsToGrid(filteredPoints, true);
    
    console.log("Points snapped to grid:", finalPoints.length);
    
    // Apply straightening based on tool
    if (tool === 'straightLine') {
      // For wall tool, always straighten
      finalPoints = straightenStroke([finalPoints[0], finalPoints[finalPoints.length - 1]]);
      console.log("Applied straightening to wall line");
      
      // Calculate and display wall length
      if (finalPoints.length >= 2) {
        const lengthInMeters = calculateDistance(finalPoints[0], finalPoints[1]);
        // Ensure we show exact multiples of 0.1m when possible
        const displayLength = isExactGridMultiple(lengthInMeters) 
          ? lengthInMeters.toFixed(1) 
          : lengthInMeters.toFixed(2);
          
        toast.success(`Wall length: ${displayLength}m`);
      }
    } else if (tool === 'room') {
      // For room tool, create enclosed shape with straightening between points
      const snappedPoints = [finalPoints[0]];
      
      for (let i = 1; i < finalPoints.length; i++) {
        const prevPoint = snappedPoints[i-1];
        const currentPoint = finalPoints[i];
        
        // Apply straightening between consecutive points
        const straightened = straightenStroke([prevPoint, currentPoint]);
        if (straightened.length > 1) {
          snappedPoints.push(straightened[1]);
        }
      }
      
      // For rooms, apply final straightening to close the shape nicely
      if (snappedPoints.length > 2) {
        const firstPoint = snappedPoints[0];
        const lastPoint = snappedPoints[snappedPoints.length - 1];
        
        // Apply straightening for the closing segment
        const closingSegment = straightenStroke([lastPoint, firstPoint]);
        
        // Replace last point with properly straightened closing point
        if (closingSegment.length > 1 && 
            (Math.abs(closingSegment[1].x - firstPoint.x) < 0.1 && 
             Math.abs(closingSegment[1].y - firstPoint.y) < 0.1)) {
          // If very close to first point, use exactly the first point to ensure perfect closing
          snappedPoints[snappedPoints.length - 1] = {...firstPoint};
        }
      }
      
      finalPoints = snappedPoints;
      console.log("Applied straightening to room");
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
  
  return { processPoints, convertToPixelPoints };
};
