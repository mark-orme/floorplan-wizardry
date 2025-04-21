/**
 * Core geometry engine
 * @module utils/geometry/engine
 */

import { Point, Rectangle } from '@/types/core/Geometry';

/**
 * Calculate the area of a polygon
 * @param points Array of points defining the polygon
 * @returns Area of the polygon
 */
export function calculatePolygonArea(points: Point[]): number {
  if (!points || points.length < 3) {
    return 0;
  }

  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  return Math.abs(area / 2);
}

/**
 * Calculate the Gross Internal Area (GIA) using the polygon area and scale
 * @param points Array of points defining the polygon
 * @param scale Scale factor (pixels per meter)
 * @returns GIA in square meters
 */
export function calculateGIA(points: Point[], scale: number = 1): number {
  if (!points || points.length < 3 || scale <= 0) {
    return 0;
  }
  const areaInPixels = calculatePolygonArea(points);
  return areaInPixels / (scale * scale);
}

/**
 * Rotate a point around an origin point
 * @param point Point to rotate
 * @param origin Origin point to rotate around
 * @param angle Angle in radians
 * @returns Rotated point
 */
export function rotatePoint(point: Point, origin: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + (dx * cos - dy * sin),
    y: origin.y + (dx * sin + dy * cos)
  };
}

/**
 * Translate a point
 * @param point Point to translate
 * @param dx X-axis translation
 * @param dy Y-axis translation
 * @returns Translated point
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

/**
 * Scale a point relative to an origin
 * @param point Point to scale
 * @param origin Origin point for scaling
 * @param scaleX X-axis scale factor
 * @param scaleY Y-axis scale factor
 * @returns Scaled point
 */
export function scalePoint(point: Point, origin: Point, scaleX: number, scaleY: number = scaleX): Point {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
}

/**
 * Check if a polygon is valid
 * @param points Array of points defining the polygon
 * @returns True if the polygon is valid
 */
export function validatePolygon(points: Point[]): boolean {
  return points && points.length >= 3;
}

/**
 * Check if a polygon is closed
 * @param points Array of points defining the polygon
 * @returns True if the polygon is closed
 */
export function isPolygonClosed(points: Point[]): boolean {
  if (!points || points.length < 3) {
    return false;
  }
  
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  // Check if first and last points are the same (within a small epsilon)
  const epsilon = 0.0001;
  return Math.abs(firstPoint.x - lastPoint.x) < epsilon && 
         Math.abs(firstPoint.y - lastPoint.y) < epsilon;
}

/**
 * Get the bounding box of a set of points
 * @param points Array of points
 * @returns Rectangle representing the bounding box
 */
export function getBoundingBox(points: Point[]): Rectangle {
  if (!points || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Get the midpoint between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Midpoint
 */
export function getMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Calculate the midpoint
 * @param points Array of points
 * @returns Midpoint
 */
export function calculateMidpoint(points: Point[]): Point {
  if (!points || points.length === 0) {
    return { x: 0, y: 0 };
  }
  
  let sumX = 0, sumY = 0;
  
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
}

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @param scale Scale factor (pixels per meter)
 * @returns Value in meters
 */
export function pixelsToMeters(pixels: number, scale: number): number {
  if (scale <= 0) {
    return 0;
  }
  return pixels / scale;
}

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @param scale Scale factor (pixels per meter)
 * @returns Value in pixels
 */
export function metersToPixels(meters: number, scale: number): number {
  return meters * scale;
}

/**
 * Calculate the distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Angle in radians
 */
export function calculateAngle(point1: Point, point2: Point): number {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x);
}

/**
 * Format a distance for display
 * @param distance Distance in pixels
 * @param scale Scale factor (pixels per unit)
 * @param unit Unit of measurement
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, scale: number = 1, unit: string = 'm'): string {
  const meters = pixelsToMeters(distance, scale);
  return `${meters.toFixed(2)}${unit}`;
}

/**
 * Format a distance for display with appropriate units
 * @param distance Distance in pixels
 * @param scale Scale factor (pixels per meter)
 * @returns Formatted distance string
 */
export function formatDisplayDistance(distance: number, scale: number = 1): string {
  const meters = pixelsToMeters(distance, scale);
  
  if (meters < 0.01) {
    return `${(meters * 1000).toFixed(0)}mm`;
  } else if (meters < 1) {
    return `${(meters * 100).toFixed(0)}cm`;
  } else {
    return `${meters.toFixed(2)}m`;
  }
}

/**
 * Check if a value is an exact multiple of the grid size
 * @param value Value to check
 * @param gridSize Grid size
 * @param tolerance Tolerance for floating point comparison
 * @returns True if the value is an exact multiple of the grid size
 */
export function isExactGridMultiple(value: number, gridSize: number, tolerance: number = 0.001): boolean {
  if (gridSize === 0) return false;
  const ratio = value / gridSize;
  const nearest = Math.round(ratio);
  return Math.abs(ratio - nearest) < tolerance;
}

/**
 * Get distance between two points (alias for calculateDistance)
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance
 */
export function getDistance(point1: Point, point2: Point): number {
  return calculateDistance(point1, point2);
}

/**
 * Calculate the perpendicular distance from a point to a line
 * @param point The point
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns Perpendicular distance
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is just a point, return the distance to that point
  if (dx === 0 && dy === 0) {
    const xDiff = point.x - lineStart.x;
    const yDiff = point.y - lineStart.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }
  
  // Calculate perpendicular distance
  const lineLengthSquared = dx * dx + dy * dy;
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
  
  if (t < 0) {
    // Point is beyond the lineStart end of the line
    return Math.sqrt(
      (point.x - lineStart.x) * (point.x - lineStart.x) + 
      (point.y - lineStart.y) * (point.y - lineStart.y)
    );
  }
  
  if (t > 1) {
    // Point is beyond the lineEnd end of the line
    return Math.sqrt(
      (point.x - lineEnd.x) * (point.x - lineEnd.x) + 
      (point.y - lineEnd.y) * (point.y - lineEnd.y)
    );
  }
  
  // Point is between the line endpoints
  const projectX = lineStart.x + t * dx;
  const projectY = lineStart.y + t * dy;
  
  return Math.sqrt(
    (point.x - projectX) * (point.x - projectX) + 
    (point.y - projectY) * (point.y - projectY)
  );
}

/**
 * Simplify a path using the Douglas-Peucker algorithm
 * @param points Array of points
 * @param tolerance Tolerance for simplification
 * @returns Simplified path
 */
export function simplifyPath(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) {
    return [...points];
  }
  
  // Find the point with the maximum distance
  const findFurthestPoint = (start: Point, end: Point, points: Point[]): { index: number, distance: number } => {
    let maxDistance = 0;
    let index = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], start, end);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    return { index, distance: maxDistance };
  };
  
  // Recursive Douglas-Peucker algorithm
  const douglasPeucker = (points: Point[], tolerance: number): Point[] => {
    if (points.length <= 2) return points;
    
    const { index, distance } = findFurthestPoint(points[0], points[points.length - 1], points);
    
    if (distance > tolerance) {
      // Recursive case: split and simplify
      const firstHalf = douglasPeucker(points.slice(0, index + 1), tolerance);
      const secondHalf = douglasPeucker(points.slice(index), tolerance);
      
      // Combine results (avoiding duplicating the split point)
      return [...firstHalf.slice(0, -1), ...secondHalf];
    } else {
      // Base case: all points are within tolerance, keep only endpoints
      return [points[0], points[points.length - 1]];
    }
  };
  
  return douglasPeucker(points, tolerance);
}

/**
 * Smooth a path using a moving average
 * @param points Array of points
 * @param windowSize Size of the smoothing window
 * @returns Smoothed path
 */
export function smoothPath(points: Point[], windowSize: number = 3): Point[] {
  if (points.length <= 2 || windowSize < 2) {
    return [...points];
  }
  
  const result: Point[] = [];
  
  // Always keep the first and last points
  result.push(points[0]);
  
  // Apply smoothing to middle points
  for (let i = 1; i < points.length - 1; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    
    const halfWindow = Math.floor(windowSize / 2);
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(points.length - 1, i + halfWindow);
    
    for (let j = start; j <= end; j++) {
      sumX += points[j].x;
      sumY += points[j].y;
      count++;
    }
    
    result.push({
      x: sumX / count,
      y: sumY / count
    });
  }
  
  // Add the last point
  result.push(points[points.length - 1]);
  
  return result;
}

/**
 * Optimize points by removing duplicates and simplifying
 * @param points Array of points
 * @param tolerance Tolerance for simplification
 * @returns Optimized array of points
 */
export function optimizePoints(points: Point[], tolerance: number = 1.0): Point[] {
  if (!points || points.length <= 2) {
    return [...points];
  }
  
  // Remove duplicate consecutive points
  const noDuplicates: Point[] = [points[0]];
  
  for (let i = 1; i < points.length; i++) {
    const prev = noDuplicates[noDuplicates.length - 1];
    const curr = points[i];
    
    if (Math.abs(prev.x - curr.x) > 0.001 || Math.abs(prev.y - curr.y) > 0.001) {
      noDuplicates.push(curr);
    }
  }
  
  // If we have fewer than 3 points after removing duplicates, just return them
  if (noDuplicates.length <= 2) {
    return noDuplicates;
  }
  
  // Apply simplification
  return simplifyPath(noDuplicates, tolerance);
}

/**
 * Snap points to a grid
 * @param points Array of points
 * @param gridSize Grid size
 * @returns Array of snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  if (!points || gridSize <= 0) {
    return [...points];
  }
  
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}
