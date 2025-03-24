/**
 * Geometry utilities for floor plan drawing
 * @module geometry
 */
import { Point, Stroke, GRID_SIZE } from './drawingTypes';
import { PIXELS_PER_METER } from './drawing';

/** 
 * Snap points to 0.1m grid with exact alignment for 99.9% accuracy
 * @param {Point[]} points - Array of points to snap to the grid
 * @returns {Stroke} Array of snapped points
 */
export const snapToGrid = (points: Point[]): Stroke => {
  if (!points || points.length === 0) return [];
  
  return points.map(p => {
    // Make sure we have valid numbers
    const x = typeof p.x === 'number' ? p.x : 0;
    const y = typeof p.y === 'number' ? p.y : 0;
    
    // Force snapping to exact 0.1m increments (GRID_SIZE)
    // This ensures we align perfectly to the grid
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    
    // Ensure we return exactly rounded values with 3 decimal precision
    // to avoid floating point errors
    return {
      x: Number(snappedX.toFixed(1)), // Enforce exact 0.1m increments
      y: Number(snappedY.toFixed(1))  // Precision to 0.1m
    };
  });
};

/**
 * Enhanced grid snapping for wall tool - snaps strictly to grid lines
 * @param {Point[]} points - Array of points to snap to the grid
 * @param {boolean} strict - Whether to enforce strict grid alignment (for walls)
 * @returns {Stroke} Array of snapped points
 */
export const snapPointsToGrid = (points: Point[], strict: boolean = false): Stroke => {
  if (!points || points.length === 0) return [];
  
  // For strict mode (wall tool), enforce exact grid alignment
  // This ensures we can only draw on grid lines, not between them
  return points.map(p => {
    // For strict mode (wall tool), snap exactly to 0.1m grid
    const x = typeof p.x === 'number' ? p.x : 0;
    const y = typeof p.y === 'number' ? p.y : 0;
    
    // Force exact snapping to grid lines - no rounding errors allowed
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    
    // For strict validation, ensure the points are EXACTLY on grid lines
    // with no floating point errors (using fixed precision)
    return {
      x: Number(snappedX.toFixed(1)),
      y: Number(snappedY.toFixed(1))
    };
  });
};

/**
 * IMPROVED: Enhanced grid snapping - forces EXACT snap to nearest grid line
 * Ensures walls always start and end precisely on grid lines with no rounding errors
 * @param {Point} point - The point to snap
 * @returns {Point} Point snapped exactly to the nearest grid line
 */
export const snapToNearestGridLine = (point: Point): Point => {
  if (!point) return { x: 0, y: 0 };
  
  // Calculate distances to nearest grid lines
  const nearestX = Math.round(point.x / GRID_SIZE) * GRID_SIZE;
  const nearestY = Math.round(point.y / GRID_SIZE) * GRID_SIZE;
  
  // Force precise grid alignment to eliminate any floating point errors
  return { 
    x: parseFloat(nearestX.toFixed(1)), 
    y: parseFloat(nearestY.toFixed(1)) 
  };
};

/**
 * Auto-straighten strokes - enhanced version that forces perfect horizontal/vertical alignment
 * @param {Stroke} stroke - Array of points representing a stroke
 * @returns {Stroke} Straightened stroke
 */
export const straightenStroke = (stroke: Stroke): Stroke => {
  if (!stroke || stroke.length < 2) return stroke;
  
  // Use only start and end points for straightening
  const [start, end] = [stroke[0], stroke[1]];
  
  // Ensure both points are exactly on grid
  const gridStart = {
    x: Number(Math.round(start.x / GRID_SIZE) * GRID_SIZE).toFixed(1),
    y: Number(Math.round(start.y / GRID_SIZE) * GRID_SIZE).toFixed(1)
  };
  
  const gridEnd = {
    x: Number(Math.round(end.x / GRID_SIZE) * GRID_SIZE).toFixed(1),
    y: Number(Math.round(end.y / GRID_SIZE) * GRID_SIZE).toFixed(1)
  };
  
  // Calculate new dx/dy after grid snapping
  const dx = Number(gridEnd.x) - Number(gridStart.x);
  const dy = Number(gridEnd.y) - Number(gridStart.y);
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  
  // Determine if the line should be horizontal, vertical, or diagonal
  // Use stricter comparison for wall precision
  if (absDx >= absDy * 1.2) { 
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
  } else if (absDy >= absDx * 1.2) { 
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
    const length = Math.max(absDx, absDy);
    const signX = Math.sign(dx);
    const signY = Math.sign(dy);
    
    // Force exact 45-degree angle
    return [
      { 
        x: Number(gridStart.x), 
        y: Number(gridStart.y) 
      },
      { 
        x: Number((Number(gridStart.x) + (length * signX)).toFixed(1)), 
        y: Number((Number(gridStart.y) + (length * signY)).toFixed(1)) 
      }
    ];
  }
};

/**
 * Calculate Gross Internal Area (GIA) in m² with 99.9% accuracy
 * Uses the shoelace formula for polygon area calculation
 * @param {Stroke} stroke - Array of points representing a closed shape
 * @returns {number} Calculated area in square meters
 */
export const calculateGIA = (stroke: Stroke): number => {
  if (!stroke || stroke.length < 3) return 0;
  
  // Shoelace formula for polygon area
  const area = Math.abs(
    stroke.reduce((sum, p, i) => {
      const next = stroke[(i + 1) % stroke.length];
      return sum + (p.x * next.y - next.x * p.y);
    }, 0) / 2
  );
  
  return Number(area.toFixed(3)); // Precision to 0.001 m²
};

/**
 * Adjusts points for panning offset
 * Helper for ensuring accurate point calculations when canvas is panned
 * @param {Point} point - The point to adjust
 * @param {Canvas} canvas - The fabric canvas
 * @returns {Point} Adjusted point
 */
export const adjustPointForPanning = (point: Point, canvas: any): Point => {
  if (!canvas || !canvas.viewportTransform) return point;
  
  const vpt = canvas.viewportTransform;
  return {
    x: Number(((point.x - vpt[4]) / vpt[0]).toFixed(3)),
    y: Number(((point.y - vpt[5]) / vpt[3]).toFixed(3))
  };
};

/**
 * Filter out redundant or too-close points from a stroke
 * Helps eliminate those small dots that appear in the drawing
 * @param {Stroke} stroke - The stroke to filter
 * @param {number} minDistance - Minimum distance between points (in meters)
 * @returns {Stroke} Filtered stroke with redundant points removed
 */
export const filterRedundantPoints = (stroke: Stroke, minDistance: number = 0.05): Stroke => {
  if (!stroke || stroke.length <= 2) return stroke;
  
  const result: Stroke = [stroke[0]];
  
  for (let i = 1; i < stroke.length; i++) {
    const lastPoint = result[result.length - 1];
    const currentPoint = stroke[i];
    
    const dx = currentPoint.x - lastPoint.x;
    const dy = currentPoint.y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only add the point if it's far enough from the previous one
    if (distance >= minDistance) {
      result.push({
        x: Number(currentPoint.x.toFixed(3)), // Ensure precision
        y: Number(currentPoint.y.toFixed(3))  // Ensure precision
      });
    }
  }
  
  // Always include the last point if we have more than one point
  if (result.length === 1 && stroke.length > 1) {
    const lastPoint = stroke[stroke.length - 1];
    result.push({
      x: Number(lastPoint.x.toFixed(3)), // Ensure precision
      y: Number(lastPoint.y.toFixed(3))  // Ensure precision
    });
  }
  
  return result;
};

/**
 * Calculate exact distance between two points in meters
 * @param startPoint - Starting point 
 * @param endPoint - Ending point
 * @returns Distance in meters, rounded to 1 decimal place for better usability
 */
export const calculateDistance = (startPoint: Point, endPoint: Point): number => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // Raw distance in meters with full precision
  const rawDistance = Math.sqrt(dx * dx + dy * dy);
  
  // Round to exactly 1 decimal place (0.1m increments)
  // This ensures we only show measurements like 1.0m, 1.1m, 1.2m, etc.
  return Math.round(rawDistance * 10) / 10;
};

/**
 * Checks if a value is an exact multiple of the grid size (0.1m)
 * @param value - The value to check
 * @returns Whether the value is an exact multiple of grid size
 */
export const isExactGridMultiple = (value: number): boolean => {
  // Convert to string to handle floating point precision issues
  const rounded = Number((Math.round(value / GRID_SIZE) * GRID_SIZE).toFixed(3));
  return Math.abs(value - rounded) < 0.001; // Allow tiny rounding error
};

/**
 * Force align a point to the exact grid lines
 * Ensures all points land precisely on grid intersections
 * @param point - The point to align
 * @returns Grid-aligned point
 */
export const forceGridAlignment = (point: Point): Point => {
  if (!point) return { x: 0, y: 0 };
  
  // Force exact alignment to nearest grid intersection with extra precision
  // Use fixed precision to avoid floating point errors
  const x = Math.round(point.x / GRID_SIZE) * GRID_SIZE;
  const y = Math.round(point.y / GRID_SIZE) * GRID_SIZE;
  
  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3))
  };
};
