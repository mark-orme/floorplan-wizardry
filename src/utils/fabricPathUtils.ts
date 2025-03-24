/**
 * Utilities for working with Fabric.js path objects
 * @module fabricPathUtils
 */
import { Point } from './drawingTypes';
import { PIXELS_PER_METER } from './drawing';

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
    path.forEach((cmd, i) => {
      if (Array.isArray(cmd)) {
        if (cmd[0] === 'M' || cmd[0] === 'L') { // Move to or Line to
          points.push({ 
            x: cmd[1] / PIXELS_PER_METER, 
            y: cmd[2] / PIXELS_PER_METER 
          });
        }
        else if (cmd[0] === 'Q') { // Quadratic curve
          // Add the control point and end point
          points.push({ 
            x: cmd[3] / PIXELS_PER_METER, 
            y: cmd[4] / PIXELS_PER_METER 
          }); // End point of curve
        }
        else if (cmd[0] === 'C') { // Bezier curve
          // Add the end point of the curve
          points.push({ 
            x: cmd[5] / PIXELS_PER_METER, 
            y: cmd[6] / PIXELS_PER_METER 
          });
        }
      }
    });
    
    // If we couldn't extract points properly, at least get first and last
    if (points.length < 2 && path.length > 1) {
      // Try to get just the first and last points
      for (const cmd of path) {
        if (Array.isArray(cmd) && cmd.length >= 3) {
          if (cmd[0] === 'M' || cmd[0] === 'L') {
            points.push({ 
              x: cmd[1] / PIXELS_PER_METER, 
              y: cmd[2] / PIXELS_PER_METER 
            });
            break;
          }
        }
      }
      
      // Get the last point
      for (let i = path.length - 1; i >= 0; i--) {
        const cmd = path[i];
        if (Array.isArray(cmd) && cmd.length >= 3) {
          if (cmd[0] === 'L' || cmd[0] === 'C' || cmd[0] === 'Q') {
            const lastIdx = cmd[0] === 'L' ? 1 : cmd[0] === 'Q' ? 3 : 5;
            points.push({ 
              x: cmd[lastIdx] / PIXELS_PER_METER, 
              y: cmd[lastIdx + 1] / PIXELS_PER_METER 
            });
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error converting fabric path to points:", error);
  }
  
  // Filter out points that are too close to each other
  if (points.length > 2) {
    const filteredPoints: Point[] = [points[0]];
    const minDistance = 0.05; // Minimum distance in meters
    
    for (let i = 1; i < points.length; i++) {
      const lastPoint = filteredPoints[filteredPoints.length - 1];
      const currentPoint = points[i];
      
      const dx = currentPoint.x - lastPoint.x;
      const dy = currentPoint.y - lastPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance >= minDistance) {
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
  let prevPoint: Point | null = null;
  const minDistance = 5; // Minimum pixel distance
  
  // Process each command
  for (const cmd of pathData) {
    if (!Array.isArray(cmd)) continue;
    
    const [command, ...coords] = cmd;
    
    if (command === 'M') {
      // Always keep the first move command
      result.push(cmd);
      prevPoint = { x: coords[0], y: coords[1] };
    } 
    else if (command === 'L') {
      const currentPoint = { x: coords[0], y: coords[1] };
      
      if (prevPoint) {
        const dx = currentPoint.x - prevPoint.x;
        const dy = currentPoint.y - prevPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only add line commands if they're far enough from the previous point
        if (distance >= minDistance) {
          result.push(cmd);
          prevPoint = currentPoint;
        }
      } else {
        result.push(cmd);
        prevPoint = currentPoint;
      }
    }
    else {
      // Keep other commands (like curves) as they are
      result.push(cmd);
    }
  }
  
  // Ensure we have at least a start and end point
  if (result.length < 2 && pathData.length >= 2) {
    return [pathData[0], pathData[pathData.length - 1]];
  }
  
  return result;
};
