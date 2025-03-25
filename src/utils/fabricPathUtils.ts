
/**
 * Utilities for working with Fabric.js path objects
 * @module fabricPathUtils
 */
import { Point } from './drawingTypes';
import { PIXELS_PER_METER } from './drawing';

/**
 * Minimum distance between points to consider them separate (in meters)
 * @constant
 */
const MIN_POINT_DISTANCE = 0.05;

/** 
 * Convert fabric.js path points to our Point type 
 * @param {any[]} path - Fabric.js path array
 * @returns {Point[]} Array of points
 */
export const fabricPathToPoints = (path: any[]): Point[] => {
  if (!path || !Array.isArray(path)) return [];
  
  const points: Point[] = [];
  
  try {
    // Extract all path commands
    path.forEach((command) => {
      if (Array.isArray(command)) {
        if (command[0] === 'M' || command[0] === 'L') { // Move to or Line to
          points.push({ 
            x: command[1] / PIXELS_PER_METER, 
            y: command[2] / PIXELS_PER_METER 
          });
        }
        else if (command[0] === 'Q') { // Quadratic curve
          // Add the control point and end point
          points.push({ 
            x: command[3] / PIXELS_PER_METER, 
            y: command[4] / PIXELS_PER_METER 
          }); // End point of curve
        }
        else if (command[0] === 'C') { // Bezier curve
          // Add the end point of the curve
          points.push({ 
            x: command[5] / PIXELS_PER_METER, 
            y: command[6] / PIXELS_PER_METER 
          });
        }
      }
    });
    
    // If we couldn't extract points properly, at least get first and last
    if (points.length < 2 && path.length > 1) {
      // Try to get just the first and last points
      for (const command of path) {
        if (Array.isArray(command) && command.length >= 3) {
          if (command[0] === 'M' || command[0] === 'L') {
            points.push({ 
              x: command[1] / PIXELS_PER_METER, 
              y: command[2] / PIXELS_PER_METER 
            });
            break;
          }
        }
      }
      
      // Get the last point
      for (let i = path.length - 1; i >= 0; i--) {
        const command = path[i];
        if (Array.isArray(command) && command.length >= 3) {
          if (command[0] === 'L' || command[0] === 'C' || command[0] === 'Q') {
            const lastIndex = command[0] === 'L' ? 1 : command[0] === 'Q' ? 3 : 5;
            points.push({ 
              x: command[lastIndex] / PIXELS_PER_METER, 
              y: command[lastIndex + 1] / PIXELS_PER_METER 
            });
            break;
          }
        }
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error converting fabric path to points:", error);
    }
  }
  
  // Filter out points that are too close to each other
  if (points.length > 2) {
    const filteredPoints: Point[] = [points[0]];
    
    for (let i = 1; i < points.length; i++) {
      const lastPoint = filteredPoints[filteredPoints.length - 1];
      const currentPoint = points[i];
      
      const distanceX = currentPoint.x - lastPoint.x;
      const distanceY = currentPoint.y - lastPoint.y;
      const pointDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (pointDistance >= MIN_POINT_DISTANCE) {
        filteredPoints.push(currentPoint);
      }
    }
    
    // Always include the last point if we have more than one point and it's not already included
    const lastOriginalPoint = points[points.length - 1];
    const lastFilteredPoint = filteredPoints[filteredPoints.length - 1];
    
    if (filteredPoints.length > 0 && 
        (lastOriginalPoint.x !== lastFilteredPoint.x || 
         lastOriginalPoint.y !== lastFilteredPoint.y)) {
      filteredPoints.push(lastOriginalPoint);
    }
    
    return filteredPoints;
  }
  
  // Ensure we have at least 2 points for a proper line
  if (points.length === 1) {
    // Duplicate the single point slightly offset to create a minimal line
    points.push({ 
      x: points[0].x + 0.1, 
      y: points[0].y + 0.1 
    });
  }
  
  return points;
};

/**
 * Clean up path data to remove redundant points and normalize coordinates
 * @param {any[]} pathData - Fabric.js path data
 * @returns {any[]} Cleaned path data
 */
export const cleanPathData = (pathData: any[]): any[] => {
  if (!pathData || !Array.isArray(pathData) || pathData.length < 2) return pathData;
  
  const result: any[] = [];
  let previousPoint: Point | null = null;
  const minPixelDistance = 5; // Minimum pixel distance
  
  // Process each command
  for (const command of pathData) {
    if (!Array.isArray(command)) continue;
    
    const [commandType, ...coordinates] = command;
    
    if (commandType === 'M') {
      // Always keep the first move command
      result.push(command);
      previousPoint = { x: coordinates[0], y: coordinates[1] };
    } 
    else if (commandType === 'L') {
      const currentPoint = { x: coordinates[0], y: coordinates[1] };
      
      if (previousPoint) {
        const distanceX = currentPoint.x - previousPoint.x;
        const distanceY = currentPoint.y - previousPoint.y;
        const pointDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Only add line commands if they're far enough from the previous point
        if (pointDistance >= minPixelDistance) {
          result.push(command);
          previousPoint = currentPoint;
        }
      } else {
        result.push(command);
        previousPoint = currentPoint;
      }
    }
    else {
      // Keep other commands (like curves) as they are
      result.push(command);
    }
  }
  
  // Ensure we have at least a start and end point
  if (result.length < 2 && pathData.length >= 2) {
    return [pathData[0], pathData[pathData.length - 1]];
  }
  
  return result;
};
