/**
 * Path processing utilities
 * Functions for processing and transforming paths drawn on canvas
 * @module pathProcessingUtils
 */
import { Path as FabricPath, Point as FabricPoint } from "fabric";
import { Point } from "@/types/drawingTypes";
import { snapToGrid } from "@/utils/grid/snapping";
import logger from "@/utils/logger";

/**
 * Extract points from a Fabric.js path
 * @param {FabricPath} path - The fabric path object
 * @returns {Point[]} Array of points extracted from the path
 */
export const extractPointsFromPath = (path: FabricPath): Point[] => {
  if (!path || !path.path) {
    logger.warn("Invalid path provided to extractPointsFromPath");
    return [];
  }

  try {
    const pathArray = path.path;
    const points: Point[] = [];
    
    // Extract all points from the path array
    for (let i = 0; i < pathArray.length; i++) {
      const pathCmd = pathArray[i];
      
      // Skip 'M' (move) commands without coordinates
      if (pathCmd[0] === 'M' && pathCmd.length > 2) {
        points.push({ x: pathCmd[1], y: pathCmd[2] });
      }
      
      // Add line points from 'L' (line) commands
      if (pathCmd[0] === 'L' && pathCmd.length > 2) {
        points.push({ x: pathCmd[1], y: pathCmd[2] });
      }
      
      // Add curve points from 'Q' (quadratic) and 'C' (cubic) commands
      if ((pathCmd[0] === 'Q' || pathCmd[0] === 'C') && pathCmd.length > 4) {
        // Add the end point of the curve (last two coordinates)
        const endX = pathCmd[pathCmd.length - 2];
        const endY = pathCmd[pathCmd.length - 1];
        
        points.push({ x: endX, y: endY });
      }
    }
    
    return points;
  } catch (error) {
    logger.error("Error extracting points from path:", error);
    return [];
  }
};

/**
 * Process points from a path for drawing tools
 * @param {Point[]} points - Raw points from path
 * @param {boolean} close - Whether to close the path
 * @returns {{ finalPoints: Point[], pixelPoints: Point[] }} Processed points
 */
export const processPathPoints = (
  points: Point[],
  close: boolean = false
): { finalPoints: Point[], pixelPoints: Point[] } => {
  if (!points || points.length === 0) {
    return { finalPoints: [], pixelPoints: [] };
  }

  try {
    // Keep first and last points, filter mid-points if too many
    let filteredPoints: Point[] = [];

    if (points.length <= 4) {
      // If there are 4 or fewer points, keep them all
      filteredPoints = [...points];
    } else {
      // Always keep the first and last points
      filteredPoints = [points[0]];
      
      // Sample mid-points if there are too many
      const step = Math.max(1, Math.floor(points.length / 10));
      for (let i = step; i < points.length - 1; i += step) {
        filteredPoints.push(points[i]);
      }
      
      // Add the last point
      filteredPoints.push(points[points.length - 1]];
    }
    
    // Always snap points to grid for consistency
    const snappedPoints = filteredPoints.map(point => snapToGrid(point));
    
    // If closing the path, add the first point to the end if needed
    if (close && snappedPoints.length > 2) {
      const firstPoint = snappedPoints[0];
      const lastPoint = snappedPoints[snappedPoints.length - 1];
      
      // Only add if the last point isn't already the same as the first
      if (firstPoint.x !== lastPoint.x || firstPoint.y !== lastPoint.y) {
        snappedPoints.push({ ...firstPoint });
      }
    }
    
    return {
      finalPoints: snappedPoints,
      pixelPoints: filteredPoints
    };
  } catch (error) {
    logger.error("Error processing path points:", error);
    return { finalPoints: [], pixelPoints: [] };
  }
};

/**
 * Convert Fabric.js path to polyline points
 * @param {FabricPath} path - The fabric path object
 * @param {boolean} close - Whether to close the path
 * @returns {{ finalPoints: Point[], pixelPoints: Point[] }} Processed points
 */
export const convertPathToPolylinePoints = (
  path: FabricPath,
  close: boolean = false
): { finalPoints: Point[], pixelPoints: Point[] } => {
  try {
    const rawPoints = extractPointsFromPath(path);
    return processPathPoints(rawPoints, close);
  } catch (error) {
    logger.error("Error converting path to polyline points:", error);
    return { finalPoints: [], pixelPoints: [] };
  }
};
