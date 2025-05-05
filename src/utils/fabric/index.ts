
/**
 * Fabric.js unified API
 * Provides a consistent interface for fabric.js regardless of version
 */
import { Canvas, Object as FabricObject, IObjectOptions } from 'fabric';

// Re-export fabric.js components with proper typing
export { Canvas, FabricObject };

// Export our custom utilities
export * from './events';
export * from './canvasCleanup';
export * from './canvasValidation';
export * from './objects';
export * from './panning';
export * from './selection';

// Define additional interfaces that might not be in fabric.js typings
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
}

/**
 * Create a path object safely
 * Falls back to alternatives if fabric.Path is not available
 */
export function createPath(pathData: string, options: any = {}) {
  try {
    if (typeof fabric !== 'undefined' && fabric.Path) {
      return new fabric.Path(pathData, options);
    }
    
    // Fallback: Try to create a polyline from the path data
    return createPolyline(pathToPoints(pathData), options);
  } catch (e) {
    console.error('Error creating path:', e);
    return null;
  }
}

/**
 * Create a line object safely
 */
export function createLine(points: number[], options: any = {}) {
  try {
    if (typeof fabric !== 'undefined' && fabric.Line) {
      return new fabric.Line(points, options);
    }
    return null;
  } catch (e) {
    console.error('Error creating line:', e);
    return null;
  }
}

/**
 * Create a polyline object safely
 */
export function createPolyline(points: Array<{x: number, y: number}>, options: any = {}) {
  try {
    if (typeof fabric !== 'undefined' && fabric.Polyline) {
      return new fabric.Polyline(points, options);
    }
    return null;
  } catch (e) {
    console.error('Error creating polyline:', e);
    return null;
  }
}

/**
 * Create a group object safely
 */
export function createGroup(objects: FabricObject[], options: any = {}) {
  try {
    if (typeof fabric !== 'undefined' && fabric.Group) {
      return new fabric.Group(objects, options);
    }
    return null;
  } catch (e) {
    console.error('Error creating group:', e);
    return null;
  }
}

/**
 * Convert a path string to points
 */
function pathToPoints(pathData: string): Array<{x: number, y: number}> {
  const points: Array<{x: number, y: number}> = [];
  
  try {
    // Very simple path parser - only handles M and L commands
    const commands = pathData.match(/[MLZ][^MLZ]*/g) || [];
    let currentX = 0;
    let currentY = 0;
    
    commands.forEach(command => {
      const type = command.charAt(0);
      const args = command.substring(1).trim().split(/[\s,]+/).map(parseFloat);
      
      if (type === 'M') {
        currentX = args[0];
        currentY = args[1];
        points.push({ x: currentX, y: currentY });
      } else if (type === 'L') {
        currentX = args[0];
        currentY = args[1];
        points.push({ x: currentX, y: currentY });
      }
    });
    
    return points;
  } catch (e) {
    console.error('Error parsing path data:', e);
    return points;
  }
}
