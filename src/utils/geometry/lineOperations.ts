/**
 * Line operations utilities
 * Functions for straightening and measuring lines
 * @module lineOperations
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';
import { HORIZONTAL_BIAS, VERTICAL_BIAS, DISTANCE_PRECISION } from './constants';

/**
 * Auto-straighten strokes - enhanced version that forces perfect horizontal/vertical alignment
 * Makes walls perfectly straight by analyzing the start and end points
 * Applies bias factors to favor horizontal/vertical lines when appropriate
 * 
 * @param {Point[]} stroke - Array of points representing a stroke (in meters)
 * @returns {Point[]} Straightened stroke with perfect alignment (in meters)
 */
export const straightenStroke = (stroke: Point[]): Point[] => {
  if (!stroke || stroke.length < 2) return stroke;
  
  // Use only start and end points for straightening
  const [startPoint, endPoint] = [stroke[0], stroke[1]];
  
  // Ensure both points are exactly on grid
  const gridStart = {
    x: Number(Math.round(startPoint.x / GRID_SIZE) * GRID_SIZE).toFixed(1),
    y: Number(Math.round(startPoint.y / GRID_SIZE) * GRID_SIZE).toFixed(1)
  };
  
  const gridEnd = {
    x: Number(Math.round(endPoint.x / GRID_SIZE) * GRID_SIZE).toFixed(1),
    y: Number(Math.round(endPoint.y / GRID_SIZE) * GRID_SIZE).toFixed(1)
  };
  
  // Calculate new dx/dy after grid snapping
  const distanceX = Number(gridEnd.x) - Number(gridStart.x);
  const distanceY = Number(gridEnd.y) - Number(gridStart.y);
  const absDistanceX = Math.abs(distanceX);
  const absDistanceY = Math.abs(distanceY);
  
  // Determine if the line should be horizontal, vertical, or diagonal
  // Use stricter comparison for wall precision
  if (absDistanceX >= absDistanceY * HORIZONTAL_BIAS) { 
    // Horizontal line - keep same Y
    return [
      { 
        x: Number(gridStart.x), 
        y: Number(gridStart.y) 
      },
      { 
        x: Number(gridEnd.x), 
        y: Number(gridStart.y) 
      }
    ];
  } else if (absDistanceY >= absDistanceX * VERTICAL_BIAS) { 
    // Vertical line - keep same X
    return [
      { 
        x: Number(gridStart.x), 
        y: Number(gridStart.y) 
      },
      { 
        x: Number(gridStart.x), 
        y: Number(gridEnd.y) 
      }
    ];
  } else {
    // Diagonal line at 45 degrees
    const lineLength = Math.max(absDistanceX, absDistanceY);
    const directionX = Math.sign(distanceX);
    const directionY = Math.sign(distanceY);
    
    // Force exact 45-degree angle
    return [
      { 
        x: Number(gridStart.x), 
        y: Number(gridStart.y) 
      },
      { 
        x: Number((Number(gridStart.x) + (lineLength * directionX)).toFixed(1)), 
        y: Number((Number(gridStart.y) + (lineLength * directionY)).toFixed(1)) 
      }
    ];
  }
};

/**
 * Calculate exact distance between two points in meters
 * FIXED: Now correctly accounts for 0.1m grid size
 * @param startPoint - Starting point 
 * @param endPoint - Ending point
 * @returns Distance in meters, rounded to 1 decimal place for better usability
 */
export const calculateDistance = (startPoint: Point, endPoint: Point): number => {
  const distanceX = endPoint.x - startPoint.x;
  const distanceY = endPoint.y - startPoint.y;
  
  // Raw distance in meters with full precision
  const rawDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  
  // Round to exactly 1 decimal place (0.1m increments) to match grid size
  // This ensures we only show measurements like 1.0m, 1.1m, 1.2m, etc.
  // which aligns perfectly with our 0.1m grid
  return Math.round(rawDistance / DISTANCE_PRECISION) * DISTANCE_PRECISION;
};
