
/**
 * Utilities for converting fabric paths to points
 * @module fabricPath/pathToPoints
 */
import { Point } from '../drawingTypes';
import { PIXELS_PER_METER } from '@/constants/numerics';
import logger from '../logger';
import { PATH_COMMANDS, COMMAND_INDICES, PATH_CONSTANTS } from './types';

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
