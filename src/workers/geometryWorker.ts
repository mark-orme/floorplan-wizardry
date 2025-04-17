
/**
 * Web Worker for optimized geometry calculations
 */

// Define worker message data type
type WorkerMessageData = {
  id: string;
  type: string;
  payload: any;
};

// Point interface
interface Point {
  x: number;
  y: number;
}

// Handle incoming messages
self.addEventListener('message', (event: MessageEvent<WorkerMessageData>) => {
  const { id, type, payload } = event.data;
  
  try {
    let result;
    
    // Process different calculation types
    switch (type) {
      case 'calculateArea':
        result = calculatePolygonArea(payload.points);
        break;
        
      case 'calculateDistance':
        result = calculateDistance(payload.start, payload.end);
        break;
        
      case 'simplifyPath':
        result = simplifyPath(payload.points, payload.tolerance);
        break;
        
      case 'snapToGrid':
        result = snapPointsToGrid(payload.points, payload.gridSize);
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
    
    // Send result back to main thread
    self.postMessage({
      id,
      success: true,
      result
    });
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Calculate area of a polygon using Shoelace formula
 */
function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Calculate distance between two points
 */
function calculateDistance(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Simplify a path using Douglas-Peucker algorithm
 */
function simplifyPath(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return [...points];
  
  // Helper function to calculate perpendicular distance
  const perpendicularDistance = (point: Point, start: Point, end: Point): number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Handle case when start and end are the same point
    if (dx === 0 && dy === 0) {
      const d = calculateDistance(point, start);
      return d;
    }
    
    // Calculate perpendicular distance
    const lineLengthSquared = dx * dx + dy * dy;
    const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lineLengthSquared;
    
    if (t < 0) {
      // Point is before start, use distance to start
      return calculateDistance(point, start);
    }
    
    if (t > 1) {
      // Point is after end, use distance to end
      return calculateDistance(point, end);
    }
    
    // Calculate perpendicular intersection point
    const projectionX = start.x + t * dx;
    const projectionY = start.y + t * dy;
    
    // Return distance to intersection point
    return calculateDistance(point, { x: projectionX, y: projectionY });
  };
  
  // Recursive implementation of Douglas-Peucker
  const douglasPeucker = (pointList: Point[], epsilon: number): Point[] => {
    // Find the point with the maximum distance
    let maxDistance = 0;
    let maxIndex = 0;
    const end = pointList.length - 1;
    
    for (let i = 1; i < end; i++) {
      const distance = perpendicularDistance(pointList[i], pointList[0], pointList[end]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    // If max distance is greater than epsilon, recursively simplify
    if (maxDistance > epsilon) {
      // Recursive call
      const firstSegment = douglasPeucker(pointList.slice(0, maxIndex + 1), epsilon);
      const secondSegment = douglasPeucker(pointList.slice(maxIndex), epsilon);
      
      // Concatenate results (remove duplicate point)
      return [...firstSegment.slice(0, -1), ...secondSegment];
    } else {
      // Just return the end points
      return [pointList[0], pointList[end]];
    }
  };
  
  return douglasPeucker(points, tolerance);
}

/**
 * Snap points to a grid
 */
function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}
