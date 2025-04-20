
// Re-export all functionality
import { calculateDistance, calculateArea, calculateIntersection } from './calculations';
import { rotatePoint, scalePoint, translatePoint } from './transformations';
import { snapToGrid, snapToPoint, snapToLine } from './snapping';
import { 
  linesIntersect, 
  isPointInPolygon, 
  polygonsIntersect 
} from './collision';
import { 
  generateGridPoints, 
  generateGridLines 
} from './grid';
import { 
  simplifyPolyline 
} from './simplification';
import { 
  LineSegment, 
  Polygon, 
  Rectangle, 
  Circle, 
  GeometryType 
} from './types';

// Export all functions and types
export {
  // Calculations
  calculateDistance,
  calculateArea,
  calculateIntersection,
  
  // Transformations
  rotatePoint,
  scalePoint,
  translatePoint,
  
  // Snapping
  snapToGrid,
  snapToPoint,
  snapToLine,
  
  // Collision detection
  linesIntersect,
  isPointInPolygon,
  polygonsIntersect,
  
  // Grid
  generateGridPoints,
  generateGridLines,
  
  // Simplification
  simplifyPolyline,
  
  // Types
  LineSegment,
  Polygon,
  Rectangle,
  Circle,
  GeometryType
};
