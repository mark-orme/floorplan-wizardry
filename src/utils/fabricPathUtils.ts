/**
 * Utilities for working with Fabric.js path objects
 * @module fabricPathUtils
 */
import { Point } from './drawingTypes';
import { PIXELS_PER_METER } from './drawing';
import logger from './logger';

/**
 * Path processing constants
 */
const PATH_CONSTANTS = {
  /**
   * Minimum distance between points to consider them separate (in meters)
   * Used for filtering out redundant points
   * @constant {number}
   */
  MIN_POINT_DISTANCE: 0.05,
  
  /**
   * Minimum distance between points in pixels
   * Used for cleanPathData function
   * @constant {number}
   */
  MIN_PIXEL_DISTANCE: 5,
  
  /**
   * Minimal offset for single-point paths
   * When a path has only one point, this offset creates a second point
   * @constant {number}
   */
  SINGLE_POINT_OFFSET: 0.1
};

/**
 * Path command types used in fabricPathToPoints
 */
const PATH_COMMANDS = {
  /**
   * Move to command
   * @constant {string}
   */
  MOVE_TO: 'M',
  
  /**
   * Line to command
   * @constant {string}
   */
  LINE_TO: 'L',
  
  /**
   * Quadratic curve command
   * @constant {string}
   */
  QUADRATIC_CURVE: 'Q',
  
  /**
   * Bezier curve command
   * @constant {string}
   */
  BEZIER_CURVE: 'C'
};

/**
 * Command index constants for accessing path data
 */
const COMMAND_INDICES = {
  /**
   * Index of command type in path command array
   * @constant {number}
   */
  COMMAND_TYPE: 0,
  
  /**
   * Index of first coordinate in path command array
   * @constant {number}
   */
  FIRST_COORD: 1,
  
  /**
   * Index of second coordinate in path command array
   * @constant {number}
   */
  SECOND_COORD: 2,
  
  /**
   * Index of quadratic curve end x-coordinate
   * @constant {number}
   */
  QUAD_END_X: 3,
  
  /**
   * Index of quadratic curve end y-coordinate
   * @constant {number}
   */
  QUAD_END_Y: 4,
  
  /**
   * Index of bezier curve end x-coordinate
   * @constant {number}
   */
  BEZIER_END_X: 5,
  
  /**
   * Index of bezier curve end y-coordinate
   * @constant {number}
   */
  BEZIER_END_Y: 6
};

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
        if (command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.MOVE_TO || 
            command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.LINE_TO) { 
          // Move to or Line to
          points.push({ 
            x: command[COMMAND_INDICES.FIRST_COORD] / PIXELS_PER_METER, 
            y: command[COMMAND_INDICES.SECOND_COORD] / PIXELS_PER_METER 
          });
        }
        else if (command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.QUADRATIC_CURVE) { 
          // Quadratic curve
          // Add the control point and end point
          points.push({ 
            x: command[COMMAND_INDICES.QUAD_END_X] / PIXELS_PER_METER, 
            y: command[COMMAND_INDICES.QUAD_END_Y] / PIXELS_PER_METER 
          }); // End point of curve
        }
        else if (command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.BEZIER_CURVE) { 
          // Bezier curve
          // Add the end point of the curve
          points.push({ 
            x: command[COMMAND_INDICES.BEZIER_END_X] / PIXELS_PER_METER, 
            y: command[COMMAND_INDICES.BEZIER_END_Y] / PIXELS_PER_METER 
          });
        }
      }
    });
    
    // If we couldn't extract points properly, at least get first and last
    if (points.length < 2 && path.length > 1) {
      // Try to get just the first and last points
      for (const command of path) {
        if (Array.isArray(command) && command.length >= 3) {
          if (command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.MOVE_TO || 
              command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.LINE_TO) {
            points.push({ 
              x: command[COMMAND_INDICES.FIRST_COORD] / PIXELS_PER_METER, 
              y: command[COMMAND_INDICES.SECOND_COORD] / PIXELS_PER_METER 
            });
            break;
          }
        }
      }
      
      // Get the last point
      for (let i = path.length - 1; i >= 0; i--) {
        const command = path[i];
        if (Array.isArray(command) && command.length >= 3) {
          if (command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.LINE_TO || 
              command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.QUADRATIC_CURVE || 
              command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.BEZIER_CURVE) {
            const lastIndex = command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.LINE_TO ? 
              COMMAND_INDICES.FIRST_COORD : 
              (command[COMMAND_INDICES.COMMAND_TYPE] === PATH_COMMANDS.QUADRATIC_CURVE ? 
                COMMAND_INDICES.QUAD_END_X : 
                COMMAND_INDICES.BEZIER_END_X);
            
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
      logger.error("Error converting fabric path to points:", error);
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
      
      if (pointDistance >= PATH_CONSTANTS.MIN_POINT_DISTANCE) {
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
      x: points[0].x + PATH_CONSTANTS.SINGLE_POINT_OFFSET, 
      y: points[0].y + PATH_CONSTANTS.SINGLE_POINT_OFFSET 
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
  
  // Process each command
  for (const command of pathData) {
    if (!Array.isArray(command)) continue;
    
    const commandType = command[COMMAND_INDICES.COMMAND_TYPE];
    
    if (commandType === PATH_COMMANDS.MOVE_TO) {
      // Always keep the first move command
      result.push(command);
      previousPoint = { 
        x: command[COMMAND_INDICES.FIRST_COORD], 
        y: command[COMMAND_INDICES.SECOND_COORD] 
      };
    } 
    else if (commandType === PATH_COMMANDS.LINE_TO) {
      const currentPoint = { 
        x: command[COMMAND_INDICES.FIRST_COORD], 
        y: command[COMMAND_INDICES.SECOND_COORD] 
      };
      
      if (previousPoint) {
        const distanceX = currentPoint.x - previousPoint.x;
        const distanceY = currentPoint.y - previousPoint.y;
        const pointDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Only add line commands if they're far enough from the previous point
        if (pointDistance >= PATH_CONSTANTS.MIN_PIXEL_DISTANCE) {
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
