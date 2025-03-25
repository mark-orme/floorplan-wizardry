/**
 * Line operations utilities
 * Functions for straightening and measuring lines
 * @module lineOperations
 */
import { Point } from '@/types/drawingTypes';
import { GRID_SIZE } from '../drawing';
import { HORIZONTAL_BIAS, VERTICAL_BIAS, DISTANCE_PRECISION } from './constants';
import logger from '../logger';

/**
 * Auto-straighten strokes - enhanced version that forces perfect horizontal/vertical alignment
 * Makes walls perfectly straight by analyzing the start and end points
 * Applies bias factors to favor horizontal/vertical lines when appropriate
 * 
 * @param {Point[]} stroke - Array of points representing a stroke (in meters)
 * @returns {Point[]} Straightened stroke with perfect alignment (in meters)
 */
export const straightenStroke = (stroke: Point[]): Point[] => {
  if (!stroke || stroke.length < 2) {
    logger.warn("Cannot straighten stroke: insufficient points", stroke);
    return stroke;
  }
  
  try {
    // Use only start and end points for straightening
    const startPoint = stroke[0];
    const endPoint = stroke[stroke.length - 1];
    
    if (!startPoint || !endPoint) {
      logger.warn("Invalid start or end point in stroke");
      return stroke;
    }
    
    // Ensure both points are exactly on grid
    const gridStart = {
      x: Math.round(startPoint.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(startPoint.y / GRID_SIZE) * GRID_SIZE
    };
    
    const gridEnd = {
      x: Math.round(endPoint.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(endPoint.y / GRID_SIZE) * GRID_SIZE
    };
    
    // Calculate new dx/dy after grid snapping
    const distanceX = gridEnd.x - gridStart.x;
    const distanceY = gridEnd.y - gridStart.y;
    const absDistanceX = Math.abs(distanceX);
    const absDistanceY = Math.abs(distanceY);
    
    // Determine if the line should be horizontal, vertical, or diagonal
    // Use stricter comparison for wall precision
    if (absDistanceX >= absDistanceY * HORIZONTAL_BIAS) { 
      // Horizontal line - keep same Y
      logger.info("Snapping to horizontal line");
      return [
        { 
          x: gridStart.x, 
          y: gridStart.y 
        },
        { 
          x: gridEnd.x, 
          y: gridStart.y 
        }
      ];
    } else if (absDistanceY >= absDistanceX * VERTICAL_BIAS) { 
      // Vertical line - keep same X
      logger.info("Snapping to vertical line");
      return [
        { 
          x: gridStart.x, 
          y: gridStart.y 
        },
        { 
          x: gridStart.x, 
          y: gridEnd.y 
        }
      ];
    } else {
      // Diagonal line at 45 degrees
      logger.info("Snapping to 45-degree diagonal line");
      const lineLength = Math.max(absDistanceX, absDistanceY);
      const directionX = Math.sign(distanceX);
      const directionY = Math.sign(distanceY);
      
      // Force exact 45-degree angle
      return [
        { 
          x: gridStart.x, 
          y: gridStart.y 
        },
        { 
          x: gridStart.x + (lineLength * directionX), 
          y: gridStart.y + (lineLength * directionY)
        }
      ];
    }
  } catch (error) {
    logger.error("Error in straightenStroke:", error);
    return stroke; // Return original stroke if any error occurs
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
  if (!startPoint || !endPoint) return 0;
  
  try {
    const distanceX = endPoint.x - startPoint.x;
    const distanceY = endPoint.y - startPoint.y;
    
    // Raw distance in meters with full precision
    const rawDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Round to exactly 1 decimal place (0.1m increments) to match grid size
    // This ensures we only show measurements like 1.0m, 1.1m, 1.2m, etc.
    // which aligns perfectly with our 0.1m grid
    return Math.round(rawDistance / DISTANCE_PRECISION) * DISTANCE_PRECISION;
  } catch (error) {
    logger.error("Error calculating distance:", error);
    return 0;
  }
};
