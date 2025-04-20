
// Core geometry functions
import { calculateDistance, calculateArea, calculateIntersection } from './calculations';
import { rotatePoint, scalePoint, translatePoint } from './transformations';
import { snapToGrid, snapToAngle, snapToGuideline } from './snapping';
import { 
  isPointInPolygon, 
  isLineIntersecting, 
  isRectangleOverlapping 
} from './collision';

// De-duplicate exports to avoid conflicts
import { 
  calculateCentroid as calculatePolygonCentroid, 
  optimizePoints as optimizePolyline 
} from './transformations';

// Utilities
import { createGrid, createGuidelines } from './grid';
import { polygonize, simplify } from './simplification';

// Export everything with clear naming to avoid conflicts
export {
  // Calculations
  calculateDistance,
  calculateArea,
  calculateIntersection,
  
  // Transformations
  rotatePoint,
  scalePoint,
  translatePoint,
  calculatePolygonCentroid, // Renamed
  optimizePolyline, // Renamed
  
  // Snapping
  snapToGrid,
  snapToAngle,
  snapToGuideline,
  
  // Collision detection
  isPointInPolygon,
  isLineIntersecting,
  isRectangleOverlapping,
  
  // Grid utilities
  createGrid,
  createGuidelines,
  
  // Simplification utilities
  polygonize,
  simplify
};

// Export types
export type { Point, LineSegment, Polygon, Rectangle } from './types';
