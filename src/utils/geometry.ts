
/**
 * Geometry utilities for floor plan drawing
 * @module geometry
 */
import { Point, Stroke, GRID_SIZE } from './drawingTypes';
import { PIXELS_PER_METER } from './drawing';

/** 
 * Snap points to 0.1m grid for accuracy 
 * @param {Point[]} points - Array of points to snap to the grid
 * @returns {Stroke} Array of snapped points
 */
export const snapToGrid = (points: Point[]): Stroke => {
  if (!points || points.length === 0) return [];
  
  return points.map(p => {
    // Make sure we have valid numbers
    const x = typeof p.x === 'number' ? p.x : 0;
    const y = typeof p.y === 'number' ? p.y : 0;
    
    // Snap to the 0.1m grid using GRID_SIZE
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    
    return {
      x: snappedX,
      y: snappedY,
    };
  });
};

/** 
 * Auto-straighten strokes - improved version that preserves straight lines 
 * @param {Stroke} stroke - Array of points representing a stroke
 * @returns {Stroke} Straightened stroke
 */
export const straightenStroke = (stroke: Stroke): Stroke => {
  if (!stroke || stroke.length < 2) return stroke;
  
  // Use only start and end points for straightening
  const [start, end] = [stroke[0], stroke[stroke.length - 1]];
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  
  // Determine if the line is more horizontal or vertical
  if (dx > dy * 1.2) {
    // Mostly horizontal - keep the same Y coordinate
    return [
      { x: start.x, y: start.y },
      { x: end.x, y: start.y }
    ];
  } else if (dy > dx * 1.2) {
    // Mostly vertical - keep the same X coordinate
    return [
      { x: start.x, y: start.y },
      { x: start.x, y: end.y }
    ];
  } else {
    // For diagonal lines, use 45-degree angle snapping
    const length = Math.max(dx, dy);
    const signX = Math.sign(end.x - start.x);
    const signY = Math.sign(end.y - start.y);
    
    return [
      start,
      { x: start.x + (length * signX), y: start.y + (length * signY) }
    ];
  }
};

/** 
 * Calculate Gross Internal Area (GIA) in m² 
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
    x: (point.x - vpt[4]) / vpt[0],
    y: (point.y - vpt[5]) / vpt[3]
  };
};
