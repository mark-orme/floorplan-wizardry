
import { Point } from '@/types/core/Point';
import { PIXELS_PER_METER } from '@/constants/numerics';

/**
 * Calculate the Gross Internal Area (GIA) of a polygon
 * Uses the Shoelace formula (Gauss's area formula)
 * 
 * @param polygonPoints - Array of points forming a polygon
 * @returns The area in square meters
 */
export const calculateGIA = (polygonPoints: Point[]): number => {
  if (polygonPoints.length < 3) {
    return 0; // Not a polygon
  }
  
  let area = 0;
  
  // Shoelace formula
  for (let i = 0; i < polygonPoints.length; i++) {
    const { x: x1, y: y1 } = polygonPoints[i];
    const { x: x2, y: y2 } = polygonPoints[(i + 1) % polygonPoints.length];
    area += (x1 * y2 - x2 * y1);
  }
  
  // Take absolute value and divide by 2
  const areaInPixels = Math.abs(area / 2);
  
  // Convert from pixels to square meters
  // If PIXELS_PER_METER = 100, then 10000 pixels = 1 square meter
  const areaInSquareMeters = areaInPixels / (PIXELS_PER_METER * PIXELS_PER_METER);
  
  // Round to 2 decimal places
  return Math.round(areaInSquareMeters * 100) / 100;
};

/**
 * Format GIA value with unit
 * 
 * @param area - Area value in square meters
 * @returns Formatted string with unit
 */
export const formatGIA = (area: number): string => {
  return `${area.toFixed(2)} m²`;
};

/**
 * Extract polygon points from fabric objects
 * Works with polygons, polylines, and paths
 * 
 * @param fabricObj - Fabric.js object
 * @returns Array of points
 */
export const extractPolygonPoints = (fabricObj: any): Point[] => {
  // Different object types store points differently
  if (fabricObj.type === 'polygon' || fabricObj.type === 'polyline') {
    return fabricObj.points.map((p: any) => ({ 
      x: p.x + fabricObj.left, 
      y: p.y + fabricObj.top 
    }));
  } else if (fabricObj.type === 'path') {
    // Path objects require more complex parsing
    // This is a simplified version
    const path = fabricObj.path;
    const points: Point[] = [];
    
    for (const segment of path) {
      if (segment[0] === 'M' || segment[0] === 'L') {
        points.push({ x: segment[1], y: segment[2] });
      }
    }
    
    return points;
  } else if (fabricObj.type === 'rect') {
    // For rectangles, create four corner points
    const left = fabricObj.left;
    const top = fabricObj.top;
    const right = left + fabricObj.width * fabricObj.scaleX;
    const bottom = top + fabricObj.height * fabricObj.scaleY;
    
    return [
      { x: left, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom }
    ];
  }
  
  return [];
};

/**
 * Calculate GIA from a collection of Fabric.js objects
 * 
 * @param objects - Array of Fabric.js objects
 * @returns Total GIA in square meters
 */
export const calculateTotalGIA = (objects: any[]): number => {
  // Filter objects that can be used for GIA calculation
  const validObjects = objects.filter(obj => 
    ['polygon', 'polyline', 'path', 'rect'].includes(obj.type)
  );
  
  // Calculate GIA for each object and sum
  return validObjects.reduce((total, obj) => {
    const points = extractPolygonPoints(obj);
    return total + calculateGIA(points);
  }, 0);
};
