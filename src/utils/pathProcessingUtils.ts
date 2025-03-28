
/**
 * Path processing utilities
 * @module utils/pathProcessingUtils
 */
import { FabricObject } from '@/types/fabricTypes';
import { Point } from '@/types/geometryTypes';

/**
 * Extract polygon points from fabric objects
 * @param objects Array of fabric objects to process
 * @returns Array of polygon point arrays
 */
export const extractPolygonsFromObjects = (objects: FabricObject[]): { points: Point[] }[] => {
  const polygons: { points: Point[] }[] = [];
  
  // Process each object
  for (const obj of objects) {
    // Check if object has points property
    if (obj.points && Array.isArray(obj.points)) {
      // Convert to our Point type
      const points = obj.points.map(p => ({ x: p.x, y: p.y }));
      if (points.length >= 3) { // Only include valid polygons
        polygons.push({ points });
      }
    }
    // Handle path objects
    else if (obj.path && Array.isArray(obj.path)) {
      try {
        // Extract points from path
        const points: Point[] = [];
        for (const segment of obj.path) {
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
    else if (obj.type === 'polygon' || obj.type === 'polyline') {
      try {
        const points = (obj.points || []).map(p => ({ x: p.x, y: p.y }));
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
