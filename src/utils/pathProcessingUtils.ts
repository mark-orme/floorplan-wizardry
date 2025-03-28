
// Add type guards and make the interface compatible
// Fix the issue at line 10 and other property access issues

import { FabricObject, Object as FabricObjectBase } from 'fabric';
import { Point } from '@/types/geometryTypes';

// Check if an object has points
export const hasPoints = (obj: FabricObject): obj is FabricObject & { points: Array<Point> } => {
  return 'points' in obj && Array.isArray((obj as any).points);
};

// Interface for objects with points
interface PolygonObject extends FabricObject {
  type: string; // Make type explicitly required
  points?: Array<{x: number, y: number}>;
}

// Check if an object has path data
export const hasPath = (obj: FabricObject): obj is FabricObject & { path: Array<any> } => {
  return 'path' in obj && Array.isArray((obj as any).path);
};

// Get points safely with type checking
export const getObjectPoints = (obj: FabricObject): Point[] => {
  if (hasPoints(obj)) {
    return obj.points;
  }
  return [];
};

// Get path data safely with type checking
export const getObjectPath = (obj: FabricObject): any[] => {
  if (hasPath(obj)) {
    return obj.path;
  }
  return [];
};

// Extract polygons using safe type checking
export const extractPolygonsFromObjects = (objects: FabricObject[]): Point[][] => {
  const polygons: Point[][] = [];
  
  objects.forEach(obj => {
    if (hasPoints(obj)) {
      polygons.push(obj.points);
    } else if (hasPath(obj)) {
      // Convert path to points if needed
      // Implementation depends on how paths are structured
    }
  });
  
  return polygons;
};
