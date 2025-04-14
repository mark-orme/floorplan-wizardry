
import { useCallback } from 'react';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

// Define the Point interface if it doesn't exist
interface Point {
  x: number;
  y: number;
}

export const useSnapToGrid = (props?: { fabricCanvasRef?: React.MutableRefObject<any> }) => {
  // Snap a point to the nearest grid point
  const snapPointToGrid = useCallback((point: Point): Point => {
    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    
    // Calculate the nearest grid points
    const newX = Math.round(point.x / gridSize) * gridSize;
    const newY = Math.round(point.y / gridSize) * gridSize;
    
    return { x: newX, y: newY };
  }, []);
  
  // Snap a line to be horizontal or vertical if it's close to those orientations
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    // Already snapped start point
    const snappedStart = start;
    
    // Snap end point to grid first
    const snappedEnd = snapPointToGrid(end);
    
    // Calculate angle and distance to determine if we should straighten the line
    const dx = snappedEnd.x - snappedStart.x;
    const dy = snappedEnd.y - snappedStart.y;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If distance is very small, don't modify further
    if (distance < 10) {
      return { start: snappedStart, end: snappedEnd };
    }
    
    // Determine if the line should be made perfectly horizontal or vertical
    // If the angle is within 15 degrees (0.26 radians) of horizontal or vertical
    const ANGLE_THRESHOLD = 0.26; // About 15 degrees
    
    let finalEnd = { ...snappedEnd };
    
    // Near horizontal
    if (Math.abs(angle) < ANGLE_THRESHOLD || Math.abs(angle - Math.PI) < ANGLE_THRESHOLD || Math.abs(angle + Math.PI) < ANGLE_THRESHOLD) {
      finalEnd.y = snappedStart.y; // Make perfectly horizontal
    }
    // Near vertical
    else if (Math.abs(angle - Math.PI/2) < ANGLE_THRESHOLD || Math.abs(angle + Math.PI/2) < ANGLE_THRESHOLD) {
      finalEnd.x = snappedStart.x; // Make perfectly vertical
    }
    // Near 45 degrees (optional, for diagonal lines)
    else if (Math.abs(angle - Math.PI/4) < ANGLE_THRESHOLD || Math.abs(angle + Math.PI/4) < ANGLE_THRESHOLD || 
             Math.abs(angle - 3*Math.PI/4) < ANGLE_THRESHOLD || Math.abs(angle + 3*Math.PI/4) < ANGLE_THRESHOLD) {
      // Calculate the average of dx and dy for a perfect 45-degree line
      const avg = Math.abs(dx) > Math.abs(dy) ? 
                  Math.sign(dx) * Math.abs(dy) : 
                  Math.sign(dy) * Math.abs(dx);
      
      finalEnd.x = snappedStart.x + Math.sign(dx) * Math.abs(avg);
      finalEnd.y = snappedStart.y + Math.sign(dy) * Math.abs(avg);
      
      // Ensure the endpoint is still on the grid
      finalEnd = snapPointToGrid(finalEnd);
    }
    
    return { start: snappedStart, end: finalEnd };
  }, [snapPointToGrid]);
  
  return {
    snapPointToGrid,
    snapLineToGrid
  };
};
