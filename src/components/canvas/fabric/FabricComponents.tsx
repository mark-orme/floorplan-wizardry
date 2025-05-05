
/**
 * Re-export fabric components with proper typing
 * This helps with import resolution when fabric components are used directly
 */

// Import fabric properly to avoid "Property does not exist" errors
import { Canvas, Object as FabricObject, Line, Group, Polyline, Path, IObjectOptions } from 'fabric';

// Define our own interfaces since some are missing in the fabric types
export interface IPathOptions extends IObjectOptions {
  path?: string | { x: number; y: number }[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  strokeLineCap?: string;
  strokeLineJoin?: string;
  selectable?: boolean;
}

export interface IGroupOptions extends IObjectOptions {
  originX?: string;
  originY?: string;
  selectable?: boolean;
}

export interface IPolylineOptions extends IObjectOptions {
  points?: Array<{ x: number; y: number }>;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  strokeLineCap?: string;
  strokeLineJoin?: string;
  selectable?: boolean;
}

// Define interfaces for missing components
export interface IRectOptions extends IObjectOptions {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
}

export interface ICircleOptions extends IObjectOptions {
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
}

// Export the interfaces for reuse
export { Canvas, FabricObject, Line, Group, Polyline, Path };

// Create safe functions instead of relying on direct fabric object properties
export function createPath(path: string, options: IPathOptions = {}) {
  // For fabric 4.x and above, we can use fabric.Path directly
  try {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Path) {
      return new window.fabric.Path(path, options as any);
    }
    return new Path(path, options as any);
  } catch (e) {
    console.error('Error creating fabric Path:', e);
    return null;
  }
}

export function createGroup(objects: FabricObject[], options: IGroupOptions = {}) {
  try {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Group) {
      return new window.fabric.Group(objects, options as any);
    }
    return new Group(objects, options as any);
  } catch (e) {
    console.error('Error creating fabric Group:', e);
    return null;
  }
}

export function createPolyline(points: Array<{ x: number; y: number }>, options: IPolylineOptions = {}) {
  try {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Polyline) {
      return new window.fabric.Polyline(points, options as any);
    }
    return new Polyline(points, options as any);
  } catch (e) {
    console.error('Error creating fabric Polyline:', e);
    return null;
  }
}

// Add a createRect function
export function createRect(options: IRectOptions = {}) {
  try {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Rect) {
      return new window.fabric.Rect(options as any);
    }
    return null;
  } catch (e) {
    console.error('Error creating fabric Rect:', e);
    return null;
  }
}

// Add a createCircle function
export function createCircle(options: ICircleOptions = {}) {
  try {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Circle) {
      return new window.fabric.Circle(options as any);
    }
    return null;
  } catch (e) {
    console.error('Error creating fabric Circle:', e);
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
export function isPath(object: FabricObject): object is Path {
  return object && object.type === 'path';
}

export function isGroup(object: FabricObject): object is Group {
  return object && object.type === 'group';
}

export function isPolyline(object: FabricObject): object is Polyline {
  return object && object.type === 'polyline';
}
