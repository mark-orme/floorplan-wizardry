
/**
 * Re-export fabric components with proper typing
 * This helps with import resolution when fabric components are used directly
 */

// Import fabric properly to avoid "Property does not exist" errors
import { Canvas, Object as FabricObject, Line, Rect, Circle, ILineOptions } from 'fabric';

// Define our own interfaces since some are missing in the fabric types
export interface IPathOptions {
  path?: string | { x: number; y: number }[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  strokeLineCap?: string;
  strokeLineJoin?: string;
  selectable?: boolean;
}

export interface IGroupOptions {
  objects?: FabricObject[];
  originX?: string;
  originY?: string;
  selectable?: boolean;
}

export interface IPolylineOptions {
  points?: Array<{ x: number; y: number }>;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  strokeLineCap?: string;
  strokeLineJoin?: string;
  selectable?: boolean;
}

// Export the interfaces for reuse
export { FabricObject };

// Create safe functions instead of relying on direct fabric object properties
export function createPath(path: string, options: IPathOptions = {}) {
  // Use fabric from imported fabric.require or fall back to global
  try {
    // For fabric 4.x and above, we can use fabric.Path directly
    if (typeof fabric !== 'undefined' && fabric.Path) {
      return new fabric.Path(path, options as any);
    }
    // Fallback for older versions or different fabric structure
    return null;
  } catch (e) {
    console.error('Error creating fabric Path:', e);
    return null;
  }
}

export function createGroup(objects: FabricObject[], options: IGroupOptions = {}) {
  try {
    if (typeof fabric !== 'undefined' && fabric.Group) {
      return new fabric.Group(objects, options as any);
    }
    return null;
  } catch (e) {
    console.error('Error creating fabric Group:', e);
    return null;
  }
}

export function createPolyline(points: Array<{ x: number; y: number }>, options: IPolylineOptions = {}) {
  try {
    if (typeof fabric !== 'undefined' && fabric.Polyline) {
      return new fabric.Polyline(points, options as any);
    }
    return null;
  } catch (e) {
    console.error('Error creating fabric Polyline:', e);
    return null;
  }
}

// Export constants for styling
export const DEFAULT_PATH_OPTIONS: IPathOptions = {
  stroke: '#000000',
  strokeWidth: 2,
  fill: null,
  strokeLineCap: 'round',
  strokeLineJoin: 'round',
  selectable: true
};

export const DEFAULT_POLYLINE_OPTIONS: IPolylineOptions = {
  stroke: '#000000',
  strokeWidth: 2,
  fill: null,
  strokeLineCap: 'round',
  strokeLineJoin: 'round',
  selectable: true
};

// Add type safety checks
export function isPath(object: FabricObject): boolean {
  return object && object.type === 'path';
}

export function isGroup(object: FabricObject): boolean {
  return object && object.type === 'group';
}

export function isPolyline(object: FabricObject): boolean {
  return object && object.type === 'polyline';
}
