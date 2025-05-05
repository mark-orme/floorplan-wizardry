
/**
 * Converts fabric path data to an array of points
 */
import { PATH_COMMANDS, COMMAND_INDICES, PathCommand } from './types';

interface Point {
  x: number;
  y: number;
}

/**
 * Convert fabric path data to an array of points
 * @param pathData The path data to convert
 * @returns Array of points
 */
export function fabricPathToPoints(pathData: PathCommand[] | string): Point[] {
  const points: Point[] = [];
  let currentX = 0;
  let currentY = 0;
  
  // Handle string path data
  if (typeof pathData === 'string') {
    const parsedData: PathCommand[] = [];
    const parts = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
    
    for (const part of parts) {
      const command = part[0];
      const coords = part.substring(1).trim().split(/[\s,]+/).map(parseFloat);
      parsedData.push(command);
      parsedData.push(coords);
    }
    
    pathData = parsedData;
  }
  
  if (!Array.isArray(pathData) || pathData.length < 2) {
    return points;
  }
  
  // Process each command
  for (let i = 0; i < pathData.length; i++) {
    const item = pathData[i];
    
    // Only process command strings
    if (typeof item !== 'string') continue;
    
    const command = item.toUpperCase();
    const coords = pathData[i + 1];
    
    if (!Array.isArray(coords)) continue;
    
    // Process based on command type
    switch (command) {
      case PATH_COMMANDS.MOVE_TO:
        if (coords.length >= 2) {
          currentX = coords[0];
          currentY = coords[1];
          points.push({ x: currentX, y: currentY });
        }
        break;
        
      case PATH_COMMANDS.LINE_TO:
        if (coords.length >= 2) {
          currentX = coords[0];
          currentY = coords[1];
          points.push({ x: currentX, y: currentY });
        }
        break;
        
      case PATH_COMMANDS.CURVE_TO:
        // For curves, we only add the end point
        if (coords.length >= 6) {
          currentX = coords[4];
          currentY = coords[5];
          points.push({ x: currentX, y: currentY });
        }
        break;
        
      case PATH_COMMANDS.QUAD_TO:
        // For quadratic curves, we only add the end point
        if (coords.length >= 4) {
          currentX = coords[2];
          currentY = coords[3];
          points.push({ x: currentX, y: currentY });
        }
        break;
        
      case PATH_COMMANDS.ARC_TO:
        // For arcs, we only add the end point
        if (coords.length >= 7) {
          currentX = coords[5];
          currentY = coords[6];
          points.push({ x: currentX, y: currentY });
        }
        break;
        
      // Close path by returning to the first point
      case PATH_COMMANDS.CLOSE:
        if (points.length > 0) {
          const firstPoint = points[0];
          currentX = firstPoint.x;
          currentY = firstPoint.y;
          points.push({ x: currentX, y: currentY });
        }
        break;
    }
    
    // Skip the coordinate array in the next iteration
    i++;
  }
  
  return points;
}
