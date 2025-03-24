
/**
 * Utilities for working with Fabric.js path objects
 * @module fabricPathUtils
 */
import { Point } from './drawingTypes';

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
          points.push({ x: cmd[1], y: cmd[2] });
        }
        else if (cmd[0] === 'Q') { // Quadratic curve
          // Add the control point and end point
          points.push({ x: cmd[3], y: cmd[4] }); // End point of curve
        }
        else if (cmd[0] === 'C') { // Bezier curve
          // Add the end point of the curve
          points.push({ x: cmd[5], y: cmd[6] });
        }
      }
    });
    
    // If we couldn't extract points properly, at least get first and last
    if (points.length < 2 && path.length > 1) {
      // Try to get just the first and last points
      for (const cmd of path) {
        if (Array.isArray(cmd) && cmd.length >= 3) {
          if (cmd[0] === 'M' || cmd[0] === 'L') {
            points.push({ x: cmd[1], y: cmd[2] });
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
            points.push({ x: cmd[lastIdx], y: cmd[lastIdx + 1] });
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error converting fabric path to points:", error);
  }
  
  // Ensure we have at least 2 points for a proper line
  if (points.length < 2 && points.length > 0) {
    // Duplicate the single point slightly offset to create a minimal line
    points.push({ x: points[0].x + 0.01, y: points[0].y + 0.01 });
  }
  
  return points;
};
