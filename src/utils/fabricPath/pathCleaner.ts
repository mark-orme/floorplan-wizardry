/**
 * Utilities for cleaning and optimizing fabric paths
 * @module fabricPath/pathCleaner
 */
import { Point } from '../drawingTypes';
import { PATH_COMMANDS, COMMAND_INDICES, PATH_CONSTANTS } from './types';

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
