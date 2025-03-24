
import { openDB } from 'idb';

export type Point = { x: number; y: number };
export type Stroke = Point[];
export type FloorPlan = { strokes: Stroke[]; label: string; paperSize?: 'A4' | 'A3' | 'infinite' };

// Scale factors
export const GRID_SIZE = 0.1; // 0.1m grid
export const PIXELS_PER_METER = 100; // 1 meter = 100 pixels
export const SMALL_GRID = GRID_SIZE * PIXELS_PER_METER; // 0.1m grid = 10px
export const LARGE_GRID = 1.0 * PIXELS_PER_METER; // 1.0m grid = 100px

// IndexedDB Constants
const DB_NAME = 'FloorPlanDB';
const STORE_NAME = 'floorPlans';

/** Initialize IndexedDB */
export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

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

/** Convert fabric.js path points to our Point type */
export const fabricPathToPoints = (path: any[]): Point[] => {
  if (!path || !Array.isArray(path)) return [];
  
  const points: Point[] = [];
  
  try {
    // Skip the first command which is usually a move
    for (let i = 1; i < path.length; i++) {
      if (Array.isArray(path[i])) {
        if (path[i][0] === 'L') { // Line to
          points.push({ x: path[i][1], y: path[i][2] });
        }
        else if (path[i][0] === 'M') { // Move to
          points.push({ x: path[i][1], y: path[i][2] });
        }
      }
    }
    
    // If no points were extracted, but there's at least one point in the path
    // (can happen with some fabric.js versions)
    if (points.length === 0 && path.length > 0) {
      // Try to get just the first and last points
      if (path[0][1] !== undefined && path[0][2] !== undefined) {
        points.push({ x: path[0][1], y: path[0][2] });
      }
      
      const lastCmd = path[path.length - 1];
      if (lastCmd[1] !== undefined && lastCmd[2] !== undefined) {
        points.push({ x: lastCmd[1], y: lastCmd[2] });
      }
    }
  } catch (error) {
    console.error("Error converting fabric path to points:", error);
  }
  
  return points;
};

/** Load floor plans from IndexedDB (with fallback to localStorage for migration) */
export const loadFloorPlans = async (): Promise<FloorPlan[]> => {
  try {
    // Try IndexedDB first
    const db = await getDB();
    const result = await db.get(STORE_NAME, 'current');
    
    if (result?.data) {
      return result.data;
    }
    
    // Fallback to localStorage for existing user data migration
    const saved = localStorage.getItem('floorPlans');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // Immediately save to IndexedDB for future use
      await saveFloorPlans(parsedData);
      return parsedData;
    }
  } catch (e) {
    console.error('Failed to load floor plans from IndexedDB:', e);
    
    // Final fallback to localStorage
    try {
      const saved = localStorage.getItem('floorPlans');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (localError) {
      console.error('Failed to load floor plans from localStorage:', localError);
    }
  }
  
  // Default floor plan if none exists
  return [{ strokes: [], label: 'Ground Floor', paperSize: 'infinite' }];
};

/** Save floor plans to IndexedDB (and localStorage as fallback) */
export const saveFloorPlans = async (floorPlans: FloorPlan[]): Promise<void> => {
  try {
    // Save to IndexedDB
    const db = await getDB();
    await db.put(STORE_NAME, { id: 'current', data: floorPlans });
    
    // Also save to localStorage as fallback/migration path
    localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
  } catch (e) {
    console.error('Failed to save floor plans to IndexedDB:', e);
    
    // Fallback to just localStorage
    try {
      localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
    } catch (localError) {
      console.error('Failed to save floor plans to localStorage:', localError);
    }
  }
};

