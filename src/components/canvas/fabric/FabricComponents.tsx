
/**
 * Re-export fabric components with proper typing
 * This helps with import resolution when fabric components are used directly
 */

// Import fabric properly to avoid "Property does not exist" errors
import { Canvas, Object as FabricObject } from 'fabric';

// We cannot directly import Group, Polyline, Path, so we'll get them from window.fabric at runtime
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

// Define interfaces for missing components
export interface IRectOptions {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
}

export interface ICircleOptions {
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
}

// Export the Canvas and FabricObject directly
export { Canvas, FabricObject };

// Define our own versions of fabric components that aren't properly exported
export class Line extends FabricObject {
  constructor(points: number[], options: any = {}) {
    super();
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Line) {
      return new window.fabric.Line(points, options) as any;
    }
    throw new Error('fabric.Line not available');
  }
}

export class Group {
  constructor(objects: any[], options: any = {}) {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Group) {
      return new window.fabric.Group(objects, options) as any;
    }
    throw new Error('fabric.Group not available');
  }
}

export class Polyline {
  constructor(points: Array<{ x: number; y: number }>, options: any = {}) {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Polyline) {
      return new window.fabric.Polyline(points, options) as any;
    }
    throw new Error('fabric.Polyline not available');
  }
}

export class Path {
  constructor(path: string | Array<{ x: number; y: number }>, options: any = {}) {
    if (typeof window !== 'undefined' && window.fabric && window.fabric.Path) {
      return new window.fabric.Path(path, options) as any;
    }
    throw new Error('fabric.Path not available');
  }
}

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
export function isPath(object: FabricObject): boolean {
  return object && object.type === 'path';
}

export function isGroup(object: FabricObject): boolean {
  return object && object.type === 'group';
}

export function isPolyline(object: FabricObject): boolean {
  return object && object.type === 'polyline';
}
