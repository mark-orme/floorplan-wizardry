
/**
 * Web Worker for optimized geometry calculations
 * Uses transferable objects for better performance
 */

// Define message types for type safety
type WorkerMessageData = {
  id: string;
  type: 'calculateArea' | 'calculateDistance' | 'snapToGrid' | 'optimizePoints' | 'batchProcess' | 'optimizeCanvasState';
  payload: any;
  transferList?: ArrayBuffer[];
};

// Listen for messages from the main thread
self.addEventListener('message', (event: MessageEvent<WorkerMessageData>) => {
  const { id, type, payload, transferList } = event.data;
  
  try {
    let result;
    let transferables: Transferable[] = [];
    
    // Process different calculation types
    switch (type) {
      case 'calculateArea':
        result = calculatePolygonArea(payload.points);
        break;
        
      case 'calculateDistance':
        result = calculateDistance(payload.start, payload.end);
        break;
        
      case 'snapToGrid':
        const snappedResult = snapPointsToGrid(payload.points, payload.gridSize);
        
        if (payload.useTransferable && payload.points instanceof Float32Array) {
          // Use transferable objects for large point sets
          result = {
            points: snappedResult.points,
            buffer: snappedResult.buffer
          };
          if (snappedResult.buffer) {
            transferables.push(snappedResult.buffer);
          }
        } else {
          result = snappedResult.points;
        }
        break;
        
      case 'optimizePoints':
        const optimizedResult = optimizePointsArray(
          payload.points, 
          payload.tolerance,
          payload.useTransferable
        );
        
        if (payload.useTransferable) {
          result = {
            points: optimizedResult.points,
            buffer: optimizedResult.buffer
          };
          if (optimizedResult.buffer) {
            transferables.push(optimizedResult.buffer);
          }
        } else {
          result = optimizedResult.points;
        }
        break;
        
      case 'batchProcess':
        result = processBatchOperations(payload.operations);
        break;
        
      case 'optimizeCanvasState':
        // If we received transferable objects with the state
        if (payload.hasTransferables && payload.parsed) {
          result = optimizeCanvasStateWithTransferables(payload.parsed);
        } else {
          result = optimizeCanvasState(payload.state);
        }
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
    
    // Send result back to main thread with proper formatting for postMessage
    const message = {
      id,
      success: true,
      result
    };
    
    // Use the correct postMessage format with transferables if available
    if (transferables.length > 0) {
      self.postMessage(message, { transfer: transferables });
    } else {
      self.postMessage(message);
    }
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
 * Now supports transferable Float32Array format
 */
function calculatePolygonArea(points: { x: number, y: number }[] | Float32Array): number {
  if (points instanceof Float32Array) {
    // Process typed array format (x,y pairs)
    const count = points.length / 2;
    if (count < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < count; i++) {
      const j = (i + 1) % count;
      const xi = points[i * 2];
      const yi = points[i * 2 + 1];
      const xj = points[j * 2];
      const yj = points[j * 2 + 1];
      
      area += xi * yj;
      area -= xj * yi;
    }
    
    return Math.abs(area) / 2;
  } else {
    // Process object format {x, y}
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
 * Supports both object format and typed arrays
 */
function snapPointsToGrid(
  points: { x: number, y: number }[] | Float32Array, 
  gridSize: number
): { points: { x: number, y: number }[] | Float32Array, buffer?: ArrayBuffer } {
  if (points instanceof Float32Array) {
    // Process typed array format (x,y pairs)
    const result = new Float32Array(points.length);
    
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      
      result[i] = Math.round(x / gridSize) * gridSize;
      result[i + 1] = Math.round(y / gridSize) * gridSize;
    }
    
    return {
      points: result,
      buffer: result.buffer
    };
  } else {
    // Process object format {x, y}
    return {
      points: points.map(point => ({
        x: Math.round(point.x / gridSize) * gridSize,
        y: Math.round(point.y / gridSize) * gridSize
      }))
    };
  }
}

/**
 * Convert between array formats
 */
function pointsToTypedArray(points: { x: number, y: number }[]): Float32Array {
  const result = new Float32Array(points.length * 2);
  
  for (let i = 0; i < points.length; i++) {
    result[i * 2] = points[i].x;
    result[i * 2 + 1] = points[i].y;
  }
  
  return result;
}

function typedArrayToPoints(array: Float32Array): { x: number, y: number }[] {
  const points = [];
  
  for (let i = 0; i < array.length; i += 2) {
    points.push({
      x: array[i],
      y: array[i + 1]
    });
  }
  
  return points;
}

/**
 * Optimize a points array by removing unnecessary points
 * Uses Ramer-Douglas-Peucker algorithm to simplify paths
 * Supports both object format and typed arrays
 */
function optimizePointsArray(
  points: { x: number, y: number }[] | Float32Array, 
  tolerance: number,
  useTransferable: boolean = false
): { points: { x: number, y: number }[] | Float32Array, buffer?: ArrayBuffer } {
  // Convert typed array to points if needed
  const workingPoints = points instanceof Float32Array 
    ? typedArrayToPoints(points) 
    : [...points];
  
  if (workingPoints.length <= 2) {
    if (useTransferable && points instanceof Float32Array) {
      // Clone the original array to return
      const result = new Float32Array(points);
      return { points: result, buffer: result.buffer };
    }
    return { points: [...workingPoints] };
  }
  
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
      // Point is before start of line, use distance to start
      const pdx = point.x - lineStart.x;
      const pdy = point.y - lineStart.y;
      return Math.sqrt(pdx * pdx + pdy * pdy);
    }
    
    if (t > 1) {
      // Point is after end of line, use distance to end
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
    let maxDistance = 0;
    let index = 0;
    const end = pointList.length - 1;
    
    for (let i = 1; i < end; i++) {
      const d = findPerpendicularDistance(
        pointList[i], 
        pointList[0], 
        pointList[end]
      );
      
      if (d > maxDistance) {
        index = i;
        maxDistance = d;
      }
    }
    
    // If max distance is greater than epsilon, recursively simplify
    if (maxDistance > epsilon) {
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
  
  // Run the algorithm
  const result = douglasPeucker(workingPoints, tolerance);
  
  // Convert back to original format
  if (useTransferable) {
    const typedResult = pointsToTypedArray(result);
    return { points: typedResult, buffer: typedResult.buffer };
  }
  
  return { points: result };
}

/**
 * Process multiple operations in a single worker call
 */
function processBatchOperations(operations: { type: string; payload: any }[]): any[] {
  return operations.map(op => {
    switch (op.type) {
      case 'calculateArea':
        return calculatePolygonArea(op.payload.points);
        
      case 'calculateDistance':
        return calculateDistance(op.payload.start, op.payload.end);
        
      case 'snapToGrid':
        return snapPointsToGrid(op.payload.points, op.payload.gridSize).points;
        
      case 'optimizePoints':
        return optimizePointsArray(op.payload.points, op.payload.tolerance).points;
        
      default:
        throw new Error(`Unknown batch operation type: ${op.type}`);
    }
  });
}

/**
 * Optimize canvas state for transmission
 * Removes unnecessary precision and compresses object data
 */
function optimizeCanvasState(state: string): string {
  if (!state) return '';
  
  try {
    const parsed = JSON.parse(state);
    
    // Only optimize if we have objects
    if (parsed.objects && Array.isArray(parsed.objects)) {
      // Perform optimization - reduce precision for coordinates
      parsed.objects = parsed.objects.map((obj: any) => {
        // Process coordinates with less precision if present
        if (obj.points) {
          obj.points = optimizePoints(obj.points);
        }
        
        // Handle path data if present
        if (obj.path) {
          obj.path = optimizePath(obj.path);
        }
        
        // Simplify other numeric properties
        ['left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'angle'].forEach(prop => {
          if (typeof obj[prop] === 'number') {
            obj[prop] = Number(obj[prop].toFixed(2));
          }
        });
        
        return obj;
      });
      
      return JSON.stringify(parsed);
    }
    
    // If no objects or not an array, return original
    return state;
  } catch (error) {
    // Return original on error
    return state;
  }
}

/**
 * Optimize canvas state when transferables are used
 * Directly works with the parsed object to avoid re-parsing
 */
function optimizeCanvasStateWithTransferables(parsed: any): string {
  try {
    if (parsed.objects && Array.isArray(parsed.objects)) {
      // Process objects - handle both regular points and transferable Float32Array
      parsed.objects = parsed.objects.map((obj: any) => {
        // Handle transferable point data
        if (obj.points) {
          if (obj.points instanceof Float32Array) {
            // Convert back to regular points for optimization
            obj.points = typedArrayToPoints(obj.points);
            obj.points = optimizePoints(obj.points);
          } else {
            obj.points = optimizePoints(obj.points);
          }
        }
        
        // Handle path data as before
        if (obj.path) {
          obj.path = optimizePath(obj.path);
        }
        
        // Simplify numeric properties
        ['left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'angle'].forEach(prop => {
          if (typeof obj[prop] === 'number') {
            obj[prop] = Number(obj[prop].toFixed(2));
          }
        });
        
        return obj;
      });
      
      return JSON.stringify(parsed);
    }
    
    // Return stringified version if objects array not found
    return JSON.stringify(parsed);
  } catch (error) {
    // Return stringified version on error
    return JSON.stringify(parsed);
  }
}

/**
 * Optimize points by reducing precision
 */
function optimizePoints(points: any[]): any[] {
  if (!Array.isArray(points)) return points;
  
  return points.map(point => {
    if (typeof point.x === 'number' && typeof point.y === 'number') {
      return {
        x: Number(point.x.toFixed(1)),
        y: Number(point.y.toFixed(1))
      };
    }
    return point;
  });
}

/**
 * Optimize path data by simplifying commands
 */
function optimizePath(path: any[]): any[] {
  if (!Array.isArray(path)) return path;
  
  return path.map(cmd => {
    // Each path command is an array where first item is the command
    if (Array.isArray(cmd)) {
      return cmd.map((val, index) => {
        // First item is the command letter
        if (index === 0) return val;
        // Other items are coordinates that can be rounded
        if (typeof val === 'number') {
          return Number(val.toFixed(1));
        }
        return val;
      });
    }
    return cmd;
  });
}
