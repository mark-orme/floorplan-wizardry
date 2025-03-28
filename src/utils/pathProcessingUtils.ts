// Add type guards and make the interface compatible
// Fix the issue at line 10 and other property access issues

import { FabricObject } from 'fabric';
import { Point } from '@/types/geometryTypes';

// Check if an object has points
export const hasPoints = (obj: FabricObject): boolean => {
  return 'points' in obj && Array.isArray((obj as any).points);
};

// Check if an object has path data
export const hasPath = (obj: FabricObject): boolean => {
  return 'path' in obj && Array.isArray((obj as any).path);
};

// Get points safely with type checking
export const getObjectPoints = (obj: FabricObject): Point[] => {
  if (hasPoints(obj)) {
    return (obj as any).points;
  }
  return [];
};

// Get path data safely with type checking
export const getObjectPath = (obj: FabricObject): any[] => {
  if (hasPath(obj)) {
    return (obj as any).path;
  }
  return [];
};

// Extract polygons using safe type checking
export const extractPolygonsFromObjects = (objects: FabricObject[]): Point[][] => {
  const polygons: Point[][] = [];
  
  objects.forEach(obj => {
    if (hasPoints(obj)) {
      polygons.push(getObjectPoints(obj));
    } else if (hasPath(obj)) {
      // Convert path to points if needed
      // Implementation depends on how paths are structured
    }
  });
  
  return polygons;
};

// ... keep existing code with proper type guards
