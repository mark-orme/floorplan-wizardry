
/**
 * Web Worker for geometry calculations
 * Offloads heavy calculations from the main thread
 */

// Define message types for type safety
type WorkerMessageData = {
  id: string;
  type: 'calculateArea' | 'calculateDistance' | 'snapToGrid' | 'optimizePoints';
  payload: any;
};

// Listen for messages from the main thread
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
        
      case 'snapToGrid':
        result = snapPointsToGrid(payload.points, payload.gridSize);
        break;
        
      case 'optimizePoints':
        result = optimizePointsArray(payload.points, payload.tolerance);
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
function calculatePolygonArea(points: { x: number, y: number }[]): number {
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
function calculateDistance(
  start: { x: number, y: number }, 
  end: { x: number, y: number }
): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Snap an array of points to a grid
 */
function snapPointsToGrid(
  points: { x: number, y: number }[], 
  gridSize: number
): { x: number, y: number }[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}

/**
 * Optimize a points array by removing unnecessary points
 * Uses Ramer-Douglas-Peucker algorithm to simplify paths
 */
function optimizePointsArray(
  points: { x: number, y: number }[], 
  tolerance: number
): { x: number, y: number }[] {
  if (points.length <= 2) return [...points];
  
  // Implementation of Ramer-Douglas-Peucker algorithm
  const findPerpendicularDistance = (
    point: { x: number, y: number },
    lineStart: { x: number, y: number },
    lineEnd: { x: number, y: number }
  ): number => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    
    // If line is just a point, return distance to that point
    if (dx === 0 && dy === 0) {
      const pdx = point.x - lineStart.x;
      const pdy = point.y - lineStart.y;
      return Math.sqrt(pdx * pdx + pdy * pdy);
    }
    
    // Calculate perpendicular distance
    const lineLengthSquared = dx * dx + dy * dy;
    const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
    
    if (t < 0) {
      // Point is before start of line, return distance to start
      const pdx = point.x - lineStart.x;
      const pdy = point.y - lineStart.y;
      return Math.sqrt(pdx * pdx + pdy * pdy);
    }
    
    if (t > 1) {
      // Point is after end of line, return distance to end
      const pdx = point.x - lineEnd.x;
      const pdy = point.y - lineEnd.y;
      return Math.sqrt(pdx * pdx + pdy * pdy);
    }
    
    // Point is between start and end of line, calculate perpendicular distance
    const nearestX = lineStart.x + t * dx;
    const nearestY = lineStart.y + t * dy;
    const pdx = point.x - nearestX;
    const pdy = point.y - nearestY;
    
    return Math.sqrt(pdx * pdx + pdy * pdy);
  };
  
  const douglasPeucker = (
    pointList: { x: number, y: number }[],
    epsilon: number
  ): { x: number, y: number }[] => {
    // Find the point with the maximum distance
    let dmax = 0;
    let index = 0;
    const end = pointList.length - 1;
    
    for (let i = 1; i < end; i++) {
      const d = findPerpendicularDistance(
        pointList[i], 
        pointList[0], 
        pointList[end]
      );
      
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }
    
    // If max distance is greater than epsilon, recursively simplify
    if (dmax > epsilon) {
      // Recursive call
      const firstHalf = douglasPeucker(
        pointList.slice(0, index + 1),
        epsilon
      );
      const secondHalf = douglasPeucker(
        pointList.slice(index),
        epsilon
      );
      
      // Concat the two parts and remove duplicate point
      return [...firstHalf.slice(0, -1), ...secondHalf];
    } else {
      // Just return first and last point
      return [pointList[0], pointList[end]];
    }
  };
  
  return douglasPeucker(points, tolerance);
}
