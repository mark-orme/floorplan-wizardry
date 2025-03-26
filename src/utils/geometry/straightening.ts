/**
 * Line straightening utilities
 * Provides functions for straightening wall lines and strokes
 * @module geometry/straightening
 */
import { Point } from '@/types/drawingTypes';
import { snapToGrid } from '../grid/core';
import { GRID_SIZE } from '../drawing';
import { calculateAngle } from './lineOperations';
import { ANGLE_SNAP_THRESHOLD } from './constants';

/**
 * Straightens a stroke to ensure perfect horizontal or vertical alignment
 * Critical for creating accurate wall layouts with natural drawing
 * 
 * @param {Point[]} points - The array of points to straighten
 * @returns {Point[]} Straightened array of points
 */
export const straightenStroke = (points: Point[]): Point[] => {
  if (!points || points.length < 2) return points;
  
  const result: Point[] = [];
  let lastPoint = points[0];
  result.push(snapToGrid(lastPoint, GRID_SIZE));
  
  // For lines with just two points (start and end), use angle-based snap
  if (points.length === 2) {
    const startPoint = result[0]; // Already snapped
    const endPoint = points[1];
    const angle = calculateAngle(startPoint, endPoint);
    
    // Snap to horizontal, vertical, or 45-degree angles
    let snappedAngle = angle;
    
    if (angle < (0 + ANGLE_SNAP_THRESHOLD) || angle > (360 - ANGLE_SNAP_THRESHOLD)) {
      // Snap to horizontal right (0 degrees)
      snappedAngle = 0;
    } else if (Math.abs(angle - 45) < ANGLE_SNAP_THRESHOLD) {
      // Snap to 45 degrees
      snappedAngle = 45;
    } else if (Math.abs(angle - 90) < ANGLE_SNAP_THRESHOLD) {
      // Snap to vertical up (90 degrees)
      snappedAngle = 90;
    } else if (Math.abs(angle - 135) < ANGLE_SNAP_THRESHOLD) {
      // Snap to 135 degrees
      snappedAngle = 135;
    } else if (Math.abs(angle - 180) < ANGLE_SNAP_THRESHOLD) {
      // Snap to horizontal left (180 degrees)
      snappedAngle = 180;
    } else if (Math.abs(angle - 225) < ANGLE_SNAP_THRESHOLD) {
      // Snap to 225 degrees
      snappedAngle = 225;
    } else if (Math.abs(angle - 270) < ANGLE_SNAP_THRESHOLD) {
      // Snap to vertical down (270 degrees)
      snappedAngle = 270;
    } else if (Math.abs(angle - 315) < ANGLE_SNAP_THRESHOLD) {
      // Snap to 315 degrees
      snappedAngle = 315;
    }
    
    // If the angle was snapped, use the snapped angle to calculate the end point
    if (snappedAngle !== angle) {
      const distance = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) + 
        Math.pow(endPoint.y - startPoint.y, 2)
      );
      
      const radians = snappedAngle * (Math.PI / 180);
      const newEndPoint = {
        x: startPoint.x + Math.cos(radians) * distance,
        y: startPoint.y + Math.sin(radians) * distance
      };
      
      result.push(snapToGrid(newEndPoint, GRID_SIZE));
    } else {
      // No angle snap applied, just snap to grid
      result.push(snapToGrid(endPoint, GRID_SIZE));
    }
    
    return result;
  }
  
  // For multiple points (more complex shapes), use the original straightening logic
  // Process all points except the first and last
  for (let i = 1; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];
    
    // Check if we should force horizontal or vertical
    const deltaX = Math.abs(currentPoint.x - lastPoint.x);
    const deltaY = Math.abs(currentPoint.y - lastPoint.y);
    
    // Decide if this should be a horizontal or vertical line
    if (deltaX >= deltaY) {
      // Horizontal line - keep X, snap Y to last point
      result.push({
        x: currentPoint.x,
        y: lastPoint.y
      });
    } else {
      // Vertical line - keep Y, snap X to last point
      result.push({
        x: lastPoint.x,
        y: currentPoint.y
      });
    }
    
    lastPoint = result[result.length - 1];
  }
  
  // Add the last point
  if (points.length > 1) {
    result.push(snapToGrid(points[points.length - 1], GRID_SIZE));
  }
  
  // Ensure all points are snapped to the grid
  return result.map(point => snapToGrid(point, GRID_SIZE));
};
