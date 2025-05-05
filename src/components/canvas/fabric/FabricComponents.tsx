
import * as fabric from 'fabric';

/**
 * Re-export fabric components with proper typing
 * This helps with import resolution when fabric components are used directly
 */

// Export fabric components with proper typing
export const Path = fabric.Path || fabric.Object;
export const Group = fabric.Group || fabric.Object;
export const Polyline = fabric.Polyline || fabric.Object;

// Define the interfaces that are missing
export interface IPathOptions extends fabric.IObjectOptions {
  path?: string | fabric.Point[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  strokeLineCap?: string;
  strokeLineJoin?: string;
}

export interface IGroupOptions extends fabric.IObjectOptions {
  objects?: fabric.Object[];
  originX?: string;
  originY?: string;
}

export interface IPolylineOptions extends fabric.IObjectOptions {
  points?: Array<{ x: number; y: number }>;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
  strokeLineCap?: string;
  strokeLineJoin?: string;
}

// Helper to create a Path object safely
export function createPath(path: string, options: IPathOptions = {}) {
  return new fabric.Path(path, options as any);
}

// Helper to create a Group object safely
export function createGroup(objects: fabric.Object[], options: IGroupOptions = {}) {
  return new fabric.Group(objects, options as any);
}

// Helper to create a Polyline object safely
export function createPolyline(points: Array<{ x: number; y: number }>, options: IPolylineOptions = {}) {
  return new fabric.Polyline(points, options as any);
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
export function isPath(object: fabric.Object): object is fabric.Path {
  return object && object.type === 'path';
}

export function isGroup(object: fabric.Object): object is fabric.Group {
  return object && object.type === 'group';
}

export function isPolyline(object: fabric.Object): object is fabric.Polyline {
  return object && object.type === 'polyline';
}
