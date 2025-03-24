
export type Point = { x: number; y: number };
export type Stroke = Point[];
export type FloorPlan = { strokes: Stroke[]; label: string; paperSize?: 'A4' | 'A3' | 'infinite' };

// Scale factors
export const GRID_SIZE = 0.1; // 0.1m grid
export const PIXELS_PER_METER = 100; // 1 meter = 100 pixels
export const SMALL_GRID = GRID_SIZE * PIXELS_PER_METER; // 0.1m grid = 10px
export const LARGE_GRID = 1.0 * PIXELS_PER_METER; // 1.0m grid = 100px

/** Snap points to 0.1m grid for accuracy */
export const snapToGrid = (points: Point[]): Stroke =>
  points.map(p => ({
    x: Math.round(p.x / (GRID_SIZE * PIXELS_PER_METER)) * GRID_SIZE,
    y: Math.round(p.y / (GRID_SIZE * PIXELS_PER_METER)) * GRID_SIZE,
  }));

/** Auto-straighten strokes - improved version that preserves straight lines */
export const straightenStroke = (stroke: Stroke): Stroke => {
  if (stroke.length < 2) return stroke;
  
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
  if (stroke.length < 3) return 0;
  
  // Shoelace formula for polygon area
  const area = Math.abs(
    stroke.reduce((sum, p, i) => {
      const next = stroke[(i + 1) % stroke.length];
      return sum + (p.x * next.y - next.x * p.y);
    }, 0) / 2
  );
  
  return Number(area.toFixed(3)); // Precision to 0.001 m²
};

/** Convert fabric.js path points to our Point type */
export const fabricPathToPoints = (path: any[]): Point[] => {
  const points: Point[] = [];
  
  // Skip the first command which is usually a move
  for (let i = 1; i < path.length; i++) {
    if (path[i][0] === 'L') { // Line to
      points.push({ x: path[i][1], y: path[i][2] });
    }
    else if (path[i][0] === 'M') { // Move to
      points.push({ x: path[i][1], y: path[i][2] });
    }
  }
  
  return points;
};

/** Load floor plans from localStorage */
export const loadFloorPlans = (): FloorPlan[] => {
  try {
    const saved = localStorage.getItem('floorPlans');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load floor plans:', e);
  }
  
  // Default floor plan if none exists
  return [{ strokes: [], label: 'Ground Floor', paperSize: 'infinite' }];
};

/** Save floor plans to localStorage */
export const saveFloorPlans = (floorPlans: FloorPlan[]): void => {
  try {
    localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
  } catch (e) {
    console.error('Failed to save floor plans:', e);
  }
};
