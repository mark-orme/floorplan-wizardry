
import { Point } from './types';

export interface WorkerMessageData {
  id?: string;
  type: string;
  payload: any;
}

// Define optimization functions locally since we can't import them
function optimizePoints(points: Point[], tolerance: number = 1): Point[] {
  if (points.length <= 2) return points;
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Calculate distance between curr and line from prev to next
    const d = perpendicularDistance(curr, prev, next);
    
    if (d > tolerance) {
      result.push(curr);
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
}

function snapPointsToGrid(points: Point[], gridSize: number = 10): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}

// Helper function for optimizePoints
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // Line length
  const lineLengthSquared = dx * dx + dy * dy;
  
  if (lineLengthSquared === 0) {
    // Line is actually a point
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + 
      Math.pow(point.y - lineStart.y, 2)
    );
  }
  
  // Calculate projection of point onto line
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
  
  if (t < 0) {
    // Point is beyond lineStart
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + 
      Math.pow(point.y - lineStart.y, 2)
    );
  }
  
  if (t > 1) {
    // Point is beyond lineEnd
    return Math.sqrt(
      Math.pow(point.x - lineEnd.x, 2) + 
      Math.pow(point.y - lineEnd.y, 2)
    );
  }
  
  // Perpendicular point on line
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;
  
  // Distance from point to this perpendicular point
  return Math.sqrt(
    Math.pow(point.x - projX, 2) + 
    Math.pow(point.y - projY, 2)
  );
}

// Listen for messages
self.addEventListener('message', (event: MessageEvent<WorkerMessageData>) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'optimize-points':
      const optimized = optimizePoints(payload.points, payload.tolerance);
      self.postMessage({ type: 'optimize-result', payload: optimized });
      break;
      
    case 'snap-to-grid':
      const snapped = snapPointsToGrid(payload.points, payload.gridSize);
      self.postMessage({ type: 'snap-result', payload: snapped });
      break;
      
    default:
      self.postMessage({ 
        type: 'error', 
        payload: { message: `Unknown command: ${type}` } 
      });
  }
});
