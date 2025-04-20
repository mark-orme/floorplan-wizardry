
// Core geometry types
export type { Point, LineSegment, Polygon, Rectangle } from './types';

// Export basic transformation functions
export const rotatePoint = (point: Point, origin: Point, angle: number): Point => {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos
  };
};

export const scalePoint = (point: Point, origin: Point, scale: number): Point => {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  
  return {
    x: origin.x + dx * scale,
    y: origin.y + dy * scale
  };
};

export const translatePoint = (point: Point, deltaX: number, deltaY: number): Point => {
  return {
    x: point.x + deltaX,
    y: point.y + deltaY
  };
};

// Calculation functions
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
  }
  return Math.abs(area / 2);
};

export const calculateIntersection = (line1Start: Point, line1End: Point, line2Start: Point, line2End: Point): Point | null => {
  const a1 = line1End.y - line1Start.y;
  const b1 = line1Start.x - line1End.x;
  const c1 = a1 * line1Start.x + b1 * line1Start.y;
  
  const a2 = line2End.y - line2Start.y;
  const b2 = line2Start.x - line2End.x;
  const c2 = a2 * line2Start.x + b2 * line2Start.y;
  
  const determinant = a1 * b2 - a2 * b1;
  if (determinant === 0) return null; // lines are parallel
  
  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;
  
  // Check if the intersection point is on both line segments
  const onLine1 = (
    Math.min(line1Start.x, line1End.x) <= x && x <= Math.max(line1Start.x, line1End.x) &&
    Math.min(line1Start.y, line1End.y) <= y && y <= Math.max(line1Start.y, line1End.y)
  );
  const onLine2 = (
    Math.min(line2Start.x, line2End.x) <= x && x <= Math.max(line2Start.x, line2End.x) &&
    Math.min(line2Start.y, line2End.y) <= y && y <= Math.max(line2Start.y, line2End.y)
  );
  
  return onLine1 && onLine2 ? { x, y } : null;
};

// Centroid and optimization functions
export const calculateCentroid = (points: Point[]): Point => {
  if (points.length === 0) return { x: 0, y: 0 };
  
  let sumX = 0;
  let sumY = 0;
  
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
};

export const optimizePoints = (points: Point[], tolerance: number = 1): Point[] => {
  if (points.length <= 2) return [...points];
  
  // Douglas-Peucker algorithm simplified
  const findFurthestPoint = (start: Point, end: Point, pointsToCheck: Point[]): [number, number] => {
    let maxDistance = -1;
    let index = -1;
    
    for (let i = 0; i < pointsToCheck.length; i++) {
      const point = pointsToCheck[i];
      const distance = calculatePerpendicularDistance(start, end, point);
      
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    return [index, maxDistance];
  };
  
  const calculatePerpendicularDistance = (lineStart: Point, lineEnd: Point, point: Point): number => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    
    // Line length squared
    const lineLengthSquared = dx * dx + dy * dy;
    
    if (lineLengthSquared === 0) {
      // Points are the same
      return calculateDistance(lineStart, point);
    }
    
    // Calculate projection factor
    const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
    
    if (t < 0) {
      // Point is beyond the start point
      return calculateDistance(lineStart, point);
    } else if (t > 1) {
      // Point is beyond the end point
      return calculateDistance(lineEnd, point);
    } else {
      // Point is between start and end
      const projection = {
        x: lineStart.x + t * dx,
        y: lineStart.y + t * dy
      };
      return calculateDistance(projection, point);
    }
  };
  
  const simplifyRecursive = (start: number, end: number): Point[] => {
    if (end - start <= 1) {
      return [points[start]];
    }
    
    const pointsSegment = points.slice(start + 1, end);
    const [index, maxDistance] = findFurthestPoint(points[start], points[end], pointsSegment);
    
    if (maxDistance > tolerance) {
      const actualIndex = start + 1 + index;
      const result1 = simplifyRecursive(start, actualIndex);
      const result2 = simplifyRecursive(actualIndex, end);
      
      // Remove duplicate point
      result1.pop();
      
      return [...result1, ...result2];
    } else {
      return [points[start], points[end]];
    }
  };
  
  return simplifyRecursive(0, points.length - 1);
};

// Collision detection functions
export const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const intersect = (
      ((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
      (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)
    );
    if (intersect) inside = !inside;
  }
  
  return inside;
};

export const isLineIntersecting = (line1Start: Point, line1End: Point, line2Start: Point, line2End: Point): boolean => {
  return calculateIntersection(line1Start, line1End, line2Start, line2End) !== null;
};

export const isRectangleOverlapping = (rect1: Rectangle, rect2: Rectangle): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Create simple grid and guideline utilities
export const createGrid = (width: number, height: number, cellSize: number): Point[][] => {
  const grid: Point[][] = [];
  
  for (let x = 0; x <= width; x += cellSize) {
    const verticalLine: Point[] = [
      { x, y: 0 },
      { x, y: height }
    ];
    grid.push(verticalLine);
  }
  
  for (let y = 0; y <= height; y += cellSize) {
    const horizontalLine: Point[] = [
      { x: 0, y },
      { x: width, y }
    ];
    grid.push(horizontalLine);
  }
  
  return grid;
};

export const createGuidelines = (objects: { position: Point; width: number; height: number }[]): Point[][] => {
  const guidelines: Point[][] = [];
  
  // Vertical guidelines (x-aligned)
  const xValues = new Set<number>();
  for (const obj of objects) {
    xValues.add(obj.position.x); // left edge
    xValues.add(obj.position.x + obj.width / 2); // center
    xValues.add(obj.position.x + obj.width); // right edge
  }
  
  for (const x of xValues) {
    guidelines.push([
      { x, y: 0 },
      { x, y: 10000 } // arbitrary large number
    ]);
  }
  
  // Horizontal guidelines (y-aligned)
  const yValues = new Set<number>();
  for (const obj of objects) {
    yValues.add(obj.position.y); // top edge
    yValues.add(obj.position.y + obj.height / 2); // center
    yValues.add(obj.position.y + obj.height); // bottom edge
  }
  
  for (const y of yValues) {
    guidelines.push([
      { x: 0, y },
      { x: 10000, y } // arbitrary large number
    ]);
  }
  
  return guidelines;
};

// Snapping functions
export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

export const snapToAngle = (startPoint: Point, endPoint: Point, angleStep: number): Point => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const angle = Math.atan2(dy, dx);
  
  // Snap angle to nearest angleStep
  const snappedAngle = Math.round(angle / (angleStep * Math.PI / 180)) * (angleStep * Math.PI / 180);
  
  // Calculate distance
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate new point based on snapped angle and original distance
  return {
    x: startPoint.x + Math.cos(snappedAngle) * distance,
    y: startPoint.y + Math.sin(snappedAngle) * distance
  };
};

export const snapToGuideline = (point: Point, guidelines: Point[][], threshold: number): Point => {
  let closestPoint = { ...point };
  let minDistance = threshold;
  
  for (const line of guidelines) {
    if (line.length < 2) continue;
    
    const lineStart = line[0];
    const lineEnd = line[1];
    
    // Vertical line
    if (Math.abs(lineStart.x - lineEnd.x) < 0.0001) {
      const distance = Math.abs(point.x - lineStart.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { x: lineStart.x, y: point.y };
      }
    }
    
    // Horizontal line
    if (Math.abs(lineStart.y - lineEnd.y) < 0.0001) {
      const distance = Math.abs(point.y - lineStart.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { x: point.x, y: lineStart.y };
      }
    }
  }
  
  return closestPoint;
};

// Simplification utilities
export const polygonize = (points: Point[], tolerance: number = 1): Point[] => {
  return optimizePoints(points, tolerance);
};

export const simplify = (points: Point[], tolerance: number = 1): Point[] => {
  return optimizePoints(points, tolerance);
};
