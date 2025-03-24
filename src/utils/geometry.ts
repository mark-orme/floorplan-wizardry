
import { Point, Stroke, GRID_SIZE, PIXELS_PER_METER } from './drawingTypes';

/** Snap points to 0.1m grid for accuracy */
export const snapToGrid = (points: Point[]): Stroke => {
  if (!points || points.length === 0) return [];
  
  return points.map(p => {
    // Make sure we have valid numbers
    const x = typeof p.x === 'number' ? p.x : 0;
    const y = typeof p.y === 'number' ? p.y : 0;
    
    return {
      x: Math.round(x / (GRID_SIZE * PIXELS_PER_METER)) * GRID_SIZE,
      y: Math.round(y / (GRID_SIZE * PIXELS_PER_METER)) * GRID_SIZE,
    };
  });
};

/** Auto-straighten strokes - improved version that preserves straight lines */
export const straightenStroke = (stroke: Stroke): Stroke => {
  if (!stroke || stroke.length < 2) return stroke;
  
  // If it's mostly horizontal or vertical, straighten it
  const [start, end] = [stroke[0], stroke[stroke.length - 1]];
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  
  if (dx > dy * 3) {
    // Mostly horizontal
    return [
      { x: start.x, y: start.y },
      { x: end.x, y: start.y }
    ];
  } else if (dy > dx * 3) {
    // Mostly vertical
    return [
      { x: start.x, y: start.y },
      { x: start.x, y: end.y }
    ];
  }
  
  // Just return start and end points for diagonal lines
  return [start, end];
};

/** Calculate Gross Internal Area (GIA) in m² */
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
