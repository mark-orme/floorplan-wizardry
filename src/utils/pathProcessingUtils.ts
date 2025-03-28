
/**
 * Path processing utilities
 * @module pathProcessingUtils
 */
import { Object as FabricObject, Path as FabricPath } from "fabric";
import { Point } from "@/types/core/Point";
import { GRID_SPACING, SNAP_THRESHOLD } from "@/constants/numerics";

/**
 * Calculate path bounding box
 * @param path - Fabric path object
 * @returns Bounding box coordinates
 */
export const getPathBoundingBox = (path: FabricObject): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} => {
  if (!path) return { left: 0, top: 0, right: 0, bottom: 0 };
  
  // Get dimensions
  const width = path.width || 0;
  const height = path.height || 0;
  const left = path.left || 0;
  const top = path.top || 0;
  
  // Calculate right and bottom
  const right = left + width;
  const bottom = top + height;
  
  return { left, top, right, bottom };
};

/**
 * Extract points from a path
 * @param path - Fabric path object
 * @returns Array of points
 */
export const extractPathPoints = (path: FabricPath): Point[] => {
  if (!path) return [];
  
  // Access path's path array which contains drawing commands
  const pathData = path.path;
  if (!pathData || !Array.isArray(pathData)) return [];
  
  const points: Point[] = [];
  
  // Process path commands
  pathData.forEach(cmd => {
    if (Array.isArray(cmd)) {
      const command = cmd[0];
      
      // Move to or line to commands add points
      if (command === 'M' || command === 'L') {
        points.push({ x: cmd[1], y: cmd[2] });
      }
      // Cubic bezier adds control points and end point
      else if (command === 'C') {
        // Control points (not adding)
        // points.push({ x: cmd[1], y: cmd[2] });
        // points.push({ x: cmd[3], y: cmd[4] });
        // End point
        points.push({ x: cmd[5], y: cmd[6] });
      }
      // Quadratic bezier adds control point and end point
      else if (command === 'Q') {
        // Control point (not adding)
        // points.push({ x: cmd[1], y: cmd[2] });
        // End point
        points.push({ x: cmd[3], y: cmd[4] });
      }
    }
  });
  
  return points;
};

/**
 * Create a simple path from points
 * @param points - Array of points
 * @param options - Path options
 * @returns Path object in Fabric.js format
 */
export const createPathFromPoints = (points: Point[], options: any = {}): FabricPath => {
  if (!points || points.length < 2) return new FabricPath('M 0 0', options);
  
  // Build SVG path string
  let pathString = `M ${points[0].x} ${points[0].y}`;
  
  // Add line segments
  for (let i = 1; i < points.length; i++) {
    pathString += ` L ${points[i].x} ${points[i].y}`;
  }
  
  return new FabricPath(pathString, options);
};

/**
 * Snap a point to grid
 * Simple implementation for utility usage
 */
export function snapToGrid(point: Point, gridSize: number = GRID_SPACING.SMALL): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Calculate distance to nearest grid line
 */
export function distanceToNearestGridLine(point: Point, gridSize: number = GRID_SPACING.SMALL): { x: number, y: number } {
  const nearestX = Math.round(point.x / gridSize) * gridSize;
  const nearestY = Math.round(point.y / gridSize) * gridSize;
  
  return {
    x: Math.abs(point.x - nearestX),
    y: Math.abs(point.y - nearestY)
  };
}

/**
 * Snap a path's points to grid
 * @param path - Fabric path object
 * @param gridSize - Grid size
 * @returns New path with snapped points
 */
export const snapPathToGrid = (path: FabricPath, gridSize: number = GRID_SPACING.SMALL): FabricPath => {
  // Extract points
  const points = extractPathPoints(path);
  if (points.length === 0) return path;
  
  // Snap points to grid
  const snappedPoints = points.map(p => snapToGrid(p, gridSize));
  
  // Create new path with snapped points
  const options = {
    stroke: path.stroke,
    strokeWidth: path.strokeWidth,
    fill: path.fill,
    opacity: path.opacity
  };
  
  return createPathFromPoints(snappedPoints, options);
};

/**
 * Check if a path should be snapped to grid
 * @param path - Fabric path object to check
 * @returns Whether path should be snapped
 */
export const shouldSnapPathToGrid = (path: FabricPath): boolean => {
  if (!path) return false;
  
  // Extract points
  const points = extractPathPoints(path);
  if (points.length === 0) return false;
  
  // Check if any point is close to a grid line
  for (const point of points) {
    const dist = distanceToNearestGridLine(point, GRID_SPACING.SMALL);
    if (dist.x <= SNAP_THRESHOLD || dist.y <= SNAP_THRESHOLD) {
      return true;
    }
  }
  
  return false;
};
