
/**
 * Validation Service
 * Provides utilities for validating floor plans and shapes
 */
import { Point, Polygon } from '@/types/core/Geometry';
import { 
  calculatePolygonArea,
  validatePolygon,
  isPolygonClosed,
  calculateDistance
} from '@/utils/geometry/engine';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Validate a polygon shape
 */
export function validatePolygonShape(points: Point[]): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Check minimum points
  if (points.length < 3) {
    errors.push({
      code: 'INVALID_POINT_COUNT',
      message: 'Polygon must have at least 3 points',
      details: { pointCount: points.length }
    });
  }
  
  // Check if polygon is closed
  if (!isPolygonClosed(points)) {
    errors.push({
      code: 'UNCLOSED_POLYGON',
      message: 'Polygon is not closed',
      details: { firstPoint: points[0], lastPoint: points[points.length - 1] }
    });
  }
  
  // Check for self-intersection
  if (!validatePolygon(points)) {
    errors.push({
      code: 'SELF_INTERSECTING',
      message: 'Polygon contains self-intersections',
      details: { pointCount: points.length }
    });
  }
  
  // Check for zero area
  const area = calculatePolygonArea(points);
  if (area <= 0) {
    errors.push({
      code: 'ZERO_AREA',
      message: 'Polygon has zero area',
      details: { area }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate wall connections
 */
export function validateWallConnections(
  walls: { start: Point; end: Point }[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const connectionPoints: Point[] = [];
  
  // Extract all unique connection points
  walls.forEach(wall => {
    connectionPoints.push(wall.start, wall.end);
  });
  
  // Check that every wall endpoint connects to at least one other wall
  for (let i = 0; i < connectionPoints.length; i++) {
    const point = connectionPoints[i];
    let connected = false;
    
    for (let j = 0; j < connectionPoints.length; j++) {
      if (i === j) continue;
      
      const otherPoint = connectionPoints[j];
      if (calculateDistance(point, otherPoint) < 1) {
        connected = true;
        break;
      }
    }
    
    if (!connected) {
      errors.push({
        code: 'DISCONNECTED_WALL',
        message: 'Wall has a disconnected endpoint',
        details: { point }
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate floor plan dimensions
 */
export function validateFloorPlanDimensions(
  points: Point[],
  minAreaM2: number = 1,
  maxAreaM2: number = 10000
): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Calculate area
  const areaPixels = calculatePolygonArea(points);
  
  // Assuming 100 pixels = 1 meter for this validation
  const areaM2 = areaPixels / 10000;
  
  if (areaM2 < minAreaM2) {
    errors.push({
      code: 'AREA_TOO_SMALL',
      message: `Floor plan area (${areaM2.toFixed(2)} m²) is below minimum (${minAreaM2} m²)`,
      details: { area: areaM2, minimum: minAreaM2 }
    });
  }
  
  if (areaM2 > maxAreaM2) {
    errors.push({
      code: 'AREA_TOO_LARGE',
      message: `Floor plan area (${areaM2.toFixed(2)} m²) exceeds maximum (${maxAreaM2} m²)`,
      details: { area: areaM2, maximum: maxAreaM2 }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
