
/**
 * Measurement service
 * Domain logic for measurements and dimensions
 * @module packages/floorplan-core/services/measurementService
 */

import { Point, LineSegment } from '@/types/core/Geometry';
import { 
  calculateDistance, 
  calculateMidpoint, 
  calculateAngle,
  pixelsToMeters,
  formatDistance
} from '@/utils/geometry/engine';

/**
 * Measurement result interface
 */
export interface MeasurementResult {
  /** Distance in pixels */
  distancePixels: number;
  /** Distance in meters */
  distanceMeters: number;
  /** Distance in feet */
  distanceFeet: number;
  /** Formatted distance string */
  formattedDistance: string;
  /** Angle in degrees (if applicable) */
  angle?: number;
  /** Midpoint coordinates */
  midpoint: Point;
}

/**
 * Measure distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @param pixelsPerMeter Conversion factor
 * @returns Measurement result
 */
export function measureDistance(
  point1: Point, 
  point2: Point, 
  pixelsPerMeter: number = 100
): MeasurementResult {
  const distancePixels = calculateDistance(point1, point2);
  const distanceMeters = pixelsToMeters(distancePixels, pixelsPerMeter);
  const distanceFeet = distanceMeters * 3.28084;
  const angle = calculateAngle(point1, point2);
  const midpoint = calculateMidpoint(point1, point2);
  
  return {
    distancePixels,
    distanceMeters,
    distanceFeet,
    formattedDistance: formatDistance(distancePixels, pixelsPerMeter),
    angle,
    midpoint
  };
}

/**
 * Measure a line segment
 * @param line Line segment
 * @param pixelsPerMeter Conversion factor
 * @returns Measurement result
 */
export function measureLine(
  line: LineSegment,
  pixelsPerMeter: number = 100
): MeasurementResult {
  return measureDistance(line.start, line.end, pixelsPerMeter);
}

/**
 * Measure perimeter of a polygon
 * @param points Polygon points
 * @param pixelsPerMeter Conversion factor
 * @returns Total perimeter measurement
 */
export function measurePerimeter(
  points: Point[],
  pixelsPerMeter: number = 100
): MeasurementResult {
  // Handle empty or single-point polygons
  if (points.length < 2) {
    return {
      distancePixels: 0,
      distanceMeters: 0,
      distanceFeet: 0,
      formattedDistance: '0 m',
      midpoint: points[0] || { x: 0, y: 0 }
    };
  }
  
  let totalDistancePixels = 0;
  const segmentMeasurements: MeasurementResult[] = [];
  
  // Measure each segment
  for (let i = 0; i < points.length; i++) {
    const startPoint = points[i];
    const endPoint = points[(i + 1) % points.length]; // Wrap around to first point
    
    const measurement = measureDistance(startPoint, endPoint, pixelsPerMeter);
    totalDistancePixels += measurement.distancePixels;
    segmentMeasurements.push(measurement);
  }
  
  // Calculate centroid as the "midpoint" of the polygon
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const midpoint = {
    x: sumX / points.length,
    y: sumY / points.length
  };
  
  const distanceMeters = pixelsToMeters(totalDistancePixels, pixelsPerMeter);
  const distanceFeet = distanceMeters * 3.28084;
  
  return {
    distancePixels: totalDistancePixels,
    distanceMeters,
    distanceFeet,
    formattedDistance: formatDistance(totalDistancePixels, pixelsPerMeter),
    midpoint
  };
}
