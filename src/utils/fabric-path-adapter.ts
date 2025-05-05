
/**
 * Fabric.js Path Adapter
 * Provides compatibility with different versions of Fabric.js
 */

import { Canvas, Object as FabricObject, Path } from 'fabric';

interface Point {
  x: number;
  y: number;
}

/**
 * A type guard to check if an object is a Fabric.js Path
 */
export function isPath(obj: any): obj is Path {
  return obj && obj.type === 'path';
}

/**
 * Creates a path object that works with the current Fabric.js version
 */
export function createFabricPath(pathData: string | Point[], options: any = {}) {
  try {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Path) {
      return new window.fabric.Path(pathData as any, options as any);
    }
    
    // Direct import fallback
    try {
      return new Path(pathData as any, options as any);
    } catch (e) {
      console.error('Error creating path with direct import:', e);
    }
    
    throw new Error('fabric.Path not available');
  } catch (e) {
    console.error('Error creating path:', e);
    return null;
  }
}

/**
 * Safely gets path data from a path object
 */
export function getPathData(pathObj: any): string | Point[] | null {
  if (!pathObj) return null;
  
  try {
    if (pathObj.path) {
      return pathObj.path;
    }
    return null;
  } catch (e) {
    console.error('Error getting path data:', e);
    return null;
  }
}

/**
 * Safely sets path data on a path object
 */
export function setPathData(pathObj: any, pathData: string | Point[]): boolean {
  if (!pathObj) return false;
  
  try {
    if (pathObj.setPath) {
      pathObj.setPath(pathData);
      return true;
    } else if ('path' in pathObj) {
      pathObj.path = pathData;
      if (pathObj.setCoords) {
        pathObj.setCoords();
      }
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error setting path data:', e);
    return false;
  }
}

/**
 * Converts a fabric object to a Path if possible
 */
export function asFabricPath(obj: FabricObject): Path | null {
  if (!obj) return null;
  
  if (isPath(obj)) {
    return obj as unknown as Path;
  }
  return null;
}

/**
 * Create a path from points
 */
export function createPathFromPoints(points: Point[], options: any = {}): Path | null {
  if (!points || points.length < 2) return null;
  
  try {
    // Convert points to SVG path data
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return createFabricPath(pathData, options);
  } catch (e) {
    console.error('Error creating path from points:', e);
    return null;
  }
}
