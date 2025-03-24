/**
 * Geometry utilities for floor plan drawing
 * @module geometry
 */
import { Point, Stroke } from './drawingTypes';
import { PIXELS_PER_METER, GRID_SIZE } from './drawing';

// Measurement constants
const DISTANCE_PRECISION = 0.1; // Precision for distance measurements (0.1m)
const CLOSE_POINT_THRESHOLD = 0.05; // Threshold for considering points "close" (5cm)
const FLOATING_POINT_TOLERANCE = 0.001; // Tolerance for floating point comparisons (1mm)

// Straightening constants
const HORIZONTAL_BIAS = 1.2; // Bias factor for favoring horizontal lines
const VERTICAL_BIAS = 1.2; // Bias factor for favoring vertical lines

/** 
 * Snap a single point to the nearest grid intersection
 * Critical utility for ensuring walls start and end exactly on grid lines
 * @param {Point} point - The point to snap (in meters)
 * @param {number} gridSize - Optional grid size in meters (defaults to GRID_SIZE constant)
 * @returns {Point} Snapped point with exact grid alignment (in meters)
 */
export function snapToGrid(point: Point, gridSize = GRID_SIZE): Point {
  if (!point) return { x: 0, y: 0 };

  // Force exact grid alignment with no floating point errors
  // IMPORTANT: All calculations here are in METERS (world units), not pixels
  const snappedX = Math.round(point.x / gridSize) * gridSize;
  const snappedY = Math.round(point.y / gridSize) * gridSize;
  
  // Create result with exactly 1 decimal place precision to avoid floating point issues
  // Since our grid is 0.1m, using 1 decimal place ensures exact grid alignment
  const result = {
    x: Number(snappedX.toFixed(1)),
    y: Number(snappedY.toFixed(1))
  };
  
  console.log(`SnapToGrid: (${point.x.toFixed(2)}m, ${point.y.toFixed(2)}m) → (${result.x.toFixed(2)}m, ${result.y.toFixed(2)}m) with gridSize: ${gridSize}m`);
  
  return result;
}

/** 
 * Snap points to 0.1m grid with exact alignment for 99.9% accuracy
 * @param {Point[]} points - Array of points to snap to the grid (in meters)
 * @returns {Stroke} Array of snapped points
 */
export const snapPointsToGrid = (points: Point[], strict: boolean = false): Stroke => {
  if (!points || points.length === 0) return [];
  
  return points.map(p => snapToGrid(p, GRID_SIZE));
};

/**
 * IMPROVED: Enhanced grid snapping - forces EXACT snap to nearest grid line
 * Ensures walls always start and end precisely on grid lines with no rounding errors
 * @param {Point} point - The point to snap
 * @returns {Point} Point snapped exactly to the nearest grid line
 */
export const snapToNearestGridLine = (point: Point): Point => {
  // Simply use snapToGrid with the standard grid size
  return snapToGrid(point, GRID_SIZE);
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
  if (absDx >= absDy * HORIZONTAL_BIAS) { 
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
  } else if (absDy >= absDx * VERTICAL_BIAS) { 
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
 * Adjusts points for panning offset - ensures proper unit conversion
 * Helper for ensuring accurate point calculations when canvas is panned
 * @param {Point} point - The point to adjust (in pixels)
 * @param {Canvas} canvas - The fabric canvas
 * @returns {Point} Adjusted point (in meters)
 */
export const adjustPointForPanning = (point: Point, canvas: any): Point => {
  if (!canvas || !canvas.viewportTransform) return point;
  
  const vpt = canvas.viewportTransform;
  const zoom = canvas.getZoom();
  
  // First apply viewport transform to get correct pixel coordinates
  const pixelPoint = {
    x: (point.x - vpt[4]) / vpt[0],
    y: (point.y - vpt[5]) / vpt[3]
  };
  
  // Then convert from pixels to meters accounting for zoom
  return {
    x: Number((pixelPoint.x / (PIXELS_PER_METER * zoom)).toFixed(3)),
    y: Number((pixelPoint.y / (PIXELS_PER_METER * zoom)).toFixed(3))
  };
};

/**
 * Filter out redundant or too-close points from a stroke
 * Helps eliminate those small dots that appear in the drawing
 * @param {Stroke} stroke - The stroke to filter
 * @param {number} minDistance - Minimum distance between points (in meters)
 * @returns {Stroke} Filtered stroke with redundant points removed
 */
export const filterRedundantPoints = (stroke: Stroke, minDistance: number = CLOSE_POINT_THRESHOLD): Stroke => {
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
 * FIXED: Now correctly accounts for 0.1m grid size
 * @param startPoint - Starting point 
 * @param endPoint - Ending point
 * @returns Distance in meters, rounded to 1 decimal place for better usability
 */
export const calculateDistance = (startPoint: Point, endPoint: Point): number => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // Raw distance in meters with full precision
  const rawDistance = Math.sqrt(dx * dx + dy * dy);
  
  // Round to exactly 1 decimal place (0.1m increments) to match grid size
  // This ensures we only show measurements like 1.0m, 1.1m, 1.2m, etc.
  // which aligns perfectly with our 0.1m grid
  return Math.round(rawDistance / DISTANCE_PRECISION) * DISTANCE_PRECISION;
};

/**
 * Checks if a value is an exact multiple of the grid size (0.1m)
 * @param value - The value to check (in meters)
 * @returns Whether the value is an exact multiple of grid size
 */
export const isExactGridMultiple = (value: number): boolean => {
  // Convert to string to handle floating point precision issues
  const rounded = Number((Math.round(value / GRID_SIZE) * GRID_SIZE).toFixed(3));
  return Math.abs(value - rounded) < FLOATING_POINT_TOLERANCE; // Allow tiny rounding error
};

/**
 * Force align a point to the exact grid lines
 * Ensures all points land precisely on grid intersections
 * @param point - The point to align (in meters)
 * @returns Grid-aligned point (in meters)
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

/**
 * Convert pixel coordinates to meter coordinates
 * Ensures proper handling of zoom level
 * @param pixelPoint - Point in pixel coordinates
 * @param zoom - Current zoom level
 * @returns Point in meter coordinates
 */
export const pixelsToMeters = (pixelPoint: Point, zoom: number = 1): Point => {
  return {
    x: Number((pixelPoint.x / (PIXELS_PER_METER * zoom)).toFixed(3)),
    y: Number((pixelPoint.y / (PIXELS_PER_METER * zoom)).toFixed(3))
  };
};

/**
 * Convert meter coordinates to pixel coordinates
 * Ensures proper handling of zoom level
 * @param meterPoint - Point in meter coordinates
 * @param zoom - Current zoom level
 * @returns Point in pixel coordinates
 */
export const metersToPixels = (meterPoint: Point, zoom: number = 1): Point => {
  return {
    x: Number((meterPoint.x * PIXELS_PER_METER * zoom).toFixed(0)),
    y: Number((meterPoint.y * PIXELS_PER_METER * zoom).toFixed(0))
  };
};
