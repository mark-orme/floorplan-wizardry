
/**
 * Path processing utilities
 * @module utils/pathProcessingUtils
 */
import { FabricObject } from '@/types/fabricTypes';
import { Point } from '@/types/geometryTypes';

// Define custom type for Fabric objects that might have points/path properties
interface PolygonObject extends FabricObject {
  points?: Array<{x: number, y: number}>;
  path?: Array<any>;
  type?: string;
}

/**
 * Extract polygon points from fabric objects
 * @param objects Array of fabric objects to process
 * @returns Array of polygon point arrays
 */
export const extractPolygonsFromObjects = (objects: FabricObject[]): { points: Point[] }[] => {
  const polygons: { points: Point[] }[] = [];
  
  // Process each object
  for (const obj of objects) {
    const polyObj = obj as PolygonObject;
    
    // Check if object has points property
    if (polyObj.points && Array.isArray(polyObj.points)) {
      // Convert to our Point type
      const points = polyObj.points.map(p => ({ x: p.x, y: p.y }));
      if (points.length >= 3) { // Only include valid polygons
        polygons.push({ points });
      }
    }
    // Handle path objects
    else if (polyObj.path && Array.isArray(polyObj.path)) {
      try {
        // Extract points from path
        const points: Point[] = [];
        for (const segment of polyObj.path) {
          if (Array.isArray(segment) && segment.length >= 2) {
            // Add point for each path segment
            points.push({ x: segment[1], y: segment[2] });
          }
        }
        if (points.length >= 3) { // Only include valid polygons
          polygons.push({ points });
        }
      } catch (error) {
        console.error('Error processing path:', error);
      }
    }
    // Handle polygon/polyline objects
    else if (polyObj.type === 'polygon' || polyObj.type === 'polyline') {
      try {
        const pointsObj = (polyObj as any).points || [];
        const points = pointsObj.map((p: any) => ({ x: p.x, y: p.y }));
        if (points.length >= 3) {
          polygons.push({ points });
        }
      } catch (error) {
        console.error('Error processing polygon:', error);
      }
    }
  }
  
  return polygons;
};
