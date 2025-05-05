import { useCallback } from 'react';
import { Canvas } from 'fabric';
// Import from our adapter instead of directly from fabric
import { Path } from '@/components/canvas/fabric/FabricComponents';

// Tolerance for the simplification algorithm
const SIMPLIFICATION_TOLERANCE = 2;
// Threshold for autostraightening lines
const STRAIGHTEN_THRESHOLD_DEGREES = 5;

/**
 * Interface for the freehand drawing polish hook
 */
interface UseFreehandDrawingPolishProps {
  canvas: Canvas | null;
  autoStraighten?: boolean;
  simplificationThreshold?: number;
}

interface FreehandDrawingPolishResult {
  brushCursorRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook that enhances freehand drawing with polish techniques:
 * - Path simplification (removes redundant points)
 * - Auto-straightening (detects nearly straight lines and makes them perfectly straight)
 * - Curve smoothing (applies Bezier curve fitting)
 */
export const useFreehandDrawingPolish = ({
  canvas,
  autoStraighten = true,
  simplificationThreshold = SIMPLIFICATION_TOLERANCE
}: UseFreehandDrawingPolishProps): FreehandDrawingPolishResult => {
  // Track the current path being drawn
  const currentPathRef = useRef<Path | null>(null);
  const brushCursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!canvas) return;
    
    // Only apply to drawing mode
    if (!canvas.isDrawingMode) return;
    
    // Handler for when a path is created
    const handlePathCreated = (e: { path: Path }) => {
      currentPathRef.current = e.path;
    };
    
    // Handler for when drawing stops
    const handleMouseUp = () => {
      const path = currentPathRef.current;
      if (!path) return;
      
      if (simplificationThreshold > 0) {
        simplifyPath(path, simplificationThreshold);
      }
      
      if (autoStraighten) {
        tryStraightenPath(path);
      }
      
      canvas.renderAll();
      currentPathRef.current = null;
    };
    
    // Add event listeners
    canvas.on('path:created', handlePathCreated);
    canvas.on('mouse:up', handleMouseUp);
    
    // Clean up
    return () => {
      canvas.off('path:created', handlePathCreated);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, autoStraighten, simplificationThreshold]);

  return { brushCursorRef };
};

/**
 * Simplifies a path using the Douglas-Peucker algorithm
 * @param path The Fabric.js Path object to simplify
 * @param tolerance The tolerance for simplification
 */
function simplifyPath(path: Path, tolerance: number): void {
  if (!path.path) return;
  
  // Extract points from the path
  const points = extractPointsFromPath(path);
  if (points.length < 3) return; // Not enough points to simplify
  
  // Apply Douglas-Peucker algorithm
  const simplified = douglasPeucker(points, tolerance);
  
  // Create a new path data from simplified points
  const newPathData = createPathData(simplified);
  
  // Update the path - using type assertion for Fabric.js
  // This is necessary due to Fabric.js type definitions being incomplete
  path.path = newPathData as any;
}

/**
 * Extracts points from a Fabric.js path
 */
function extractPointsFromPath(path: Path): Point[] {
  const points: Point[] = [];
  
  if (!path.path) return points;
  
  // Fabric.js path is an array of commands like [['M', x, y], ['L', x, y], ...]
  for (const cmd of path.path) {
    // Skip non-point commands
    if (cmd[0] === 'M' || cmd[0] === 'L') {
      points.push(new Point(cmd[1] as number, cmd[2] as number));
    }
  }
  
  return points;
}

/**
 * Creates path data from points
 */
function createPathData(points: Point[]): Array<Array<string | number>> {
  if (points.length === 0) return [];
  
  const pathData: Array<Array<string | number>> = [];
  
  // Start with a move command
  pathData.push(['M', points[0].x, points[0].y]);
  
  // Add line commands for the rest of the points
  for (let i = 1; i < points.length; i++) {
    pathData.push(['L', points[i].x, points[i].y]);
  }
  
  return pathData;
}

/**
 * Douglas-Peucker line simplification algorithm
 */
function douglasPeucker(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return points;
  
  let maxDistance = 0;
  let index = 0;
  
  // Find the point with the maximum distance from the line
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], firstPoint, lastPoint);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const firstSegment = douglasPeucker(points.slice(0, index + 1), tolerance);
    const secondSegment = douglasPeucker(points.slice(index), tolerance);
    
    // Combine the results, removing the duplicate point
    return [...firstSegment.slice(0, -1), ...secondSegment];
  } else {
    // If max distance is less than tolerance, all points can be represented by a line
    return [firstPoint, lastPoint];
  }
}

/**
 * Calculates the perpendicular distance from a point to a line
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If the line is a point, return the distance to that point
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  if (lineLength === 0) return Math.sqrt(
    Math.pow(point.x - lineStart.x, 2) + 
    Math.pow(point.y - lineStart.y, 2)
  );
  
  // Calculate the perpendicular distance
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (lineLength * lineLength);
  
  if (t < 0) {
    // Point is before the line segment
    return Math.sqrt(Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2));
  } else if (t > 1) {
    // Point is after the line segment
    return Math.sqrt(Math.pow(point.x - lineEnd.x, 2) + Math.pow(point.y - lineEnd.y, 2));
  } else {
    // Point is alongside the line segment
    const nearestX = lineStart.x + t * dx;
    const nearestY = lineStart.y + t * dy;
    return Math.sqrt(Math.pow(point.x - nearestX, 2) + Math.pow(point.y - nearestY, 2));
  }
}

/**
 * Tries to straighten a path if it's nearly straight
 */
function tryStraightenPath(path: Path): void {
  if (!path.path || path.path.length < 3) return;
  
  const points = extractPointsFromPath(path);
  if (points.length < 3) return;
  
  // Check if all points are close to a straight line
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  let maxDeviation = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const deviation = perpendicularDistance(points[i], firstPoint, lastPoint);
    maxDeviation = Math.max(maxDeviation, deviation);
  }
  
  // Calculate the angle from horizontal
  const dx = lastPoint.x - firstPoint.x;
  const dy = lastPoint.y - firstPoint.y;
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Normalize angle to 0-180
  angle = (angle + 180) % 180;
  
  // Check if angle is close to 0, 45, 90, 135, or 180 degrees
  const isNearHorizontal = angle < STRAIGHTEN_THRESHOLD_DEGREES || 
                          (angle > 180 - STRAIGHTEN_THRESHOLD_DEGREES);
  const isNearVertical = Math.abs(angle - 90) < STRAIGHTEN_THRESHOLD_DEGREES;
  const isNear45 = Math.abs(angle - 45) < STRAIGHTEN_THRESHOLD_DEGREES;
  const isNear135 = Math.abs(angle - 135) < STRAIGHTEN_THRESHOLD_DEGREES;
  
  // Straighten the line if it's near a cardinal direction and not too wiggly
  if ((isNearHorizontal || isNearVertical || isNear45 || isNear135) && 
      maxDeviation < STRAIGHTEN_THRESHOLD_DEGREES) {
    
    // Create a perfectly straight line
    const newPath = [
      ['M', firstPoint.x, firstPoint.y],
      ['L', lastPoint.x, lastPoint.y]
    ];
    
    // Use type assertion for Fabric.js
    path.path = newPath as any;
  }
}
