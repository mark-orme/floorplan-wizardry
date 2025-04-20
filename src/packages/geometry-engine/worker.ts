
/**
 * Geometry Engine Web Worker
 * Handles geometry calculations in a separate thread
 */
import {
  LineSegment,
  Polygon,
  Point,
  WorkerMessageData,
  WorkerResponse,
  GeometryOperationOptions
} from './types';

// Set up worker message handler
self.onmessage = (event: MessageEvent<WorkerMessageData>) => {
  const { operation, payload, id } = event.data;
  let result: any = null;
  let error: string | undefined = undefined;

  try {
    // Process operation based on the operation type
    switch (operation) {
      case 'calculateIntersection':
        result = calculateIntersection(payload.line1, payload.line2, payload.options);
        break;
      case 'calculatePolygonArea':
        result = calculatePolygonArea(payload.polygon, payload.options);
        break;
      case 'isPointInPolygon':
        result = isPointInPolygon(payload.point, payload.polygon, payload.options);
        break;
      case 'calculateDistance':
        result = calculateDistance(payload.point1, payload.point2);
        break;
      default:
        error = `Unknown operation: ${operation}`;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  // Send response back to main thread
  const response: WorkerResponse = {
    result,
    id,
    error
  };

  self.postMessage(response);
};

/**
 * Calculate the intersection point of two line segments
 */
function calculateIntersection(
  line1: LineSegment,
  line2: LineSegment,
  options?: GeometryOperationOptions
): Point | null {
  // Implement intersection calculation
  // For now, returning null
  return null;
}

/**
 * Calculate the area of a polygon
 */
function calculatePolygonArea(
  polygon: Polygon,
  options?: GeometryOperationOptions
): number {
  const { points } = polygon;
  if (points.length < 3) {
    return 0;
  }

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area) / 2;
}

/**
 * Check if a point is inside a polygon
 */
function isPointInPolygon(
  point: Point,
  polygon: Polygon,
  options?: GeometryOperationOptions
): boolean {
  const { points } = polygon;
  if (points.length < 3) {
    return false;
  }

  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const { x: xi, y: yi } = points[i];
    const { x: xj, y: yj } = points[j];
    
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Calculate the distance between two points
 */
function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
