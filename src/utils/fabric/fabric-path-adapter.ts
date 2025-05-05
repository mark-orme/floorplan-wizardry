
/**
 * Fabric.js Path Adapter
 * Provides compatibility with different versions of Fabric.js
 */
import { Object as FabricObject } from 'fabric';
import { IPathOptions } from '@/components/canvas/fabric/FabricComponents';

interface Point {
  x: number;
  y: number;
}

/**
 * A type guard to check if an object is a Fabric.js Path
 */
export function isPath(obj: any): boolean {
  return obj && obj.type === 'path';
}

/**
 * Creates a path object that works with the current Fabric.js version
 */
export function createFabricPath(pathData: string | Point[], options: IPathOptions = {}) {
  try {
    if (typeof fabric !== 'undefined' && fabric.Path) {
      return new fabric.Path(pathData, options as any);
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
export function asFabricPath(obj: FabricObject): any {
  if (!obj) return null;
  
  if (isPath(obj)) {
    return obj;
  }
  return null;
}
