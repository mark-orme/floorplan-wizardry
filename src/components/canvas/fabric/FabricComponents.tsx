
import * as fabric from 'fabric';

/**
 * Re-export fabric components with proper typing
 * This helps with import resolution when fabric components are used directly
 */

// Export Path with enhanced typing
export const Path = fabric.Path;

// Export Group with enhanced typing  
export const Group = fabric.Group;

// Export Polyline with enhanced typing
export const Polyline = fabric.Polyline;

// Helper to create a Path object safely
export function createPath(path: string, options: fabric.IPathOptions = {}) {
  return new fabric.Path(path, options);
}

// Helper to create a Group object safely
export function createGroup(objects: fabric.Object[], options: fabric.IGroupOptions = {}) {
  return new fabric.Group(objects, options);
}

// Helper to create a Polyline object safely
export function createPolyline(points: Array<{ x: number; y: number }>, options: fabric.IPolylineOptions = {}) {
  return new fabric.Polyline(points, options);
}

// Export constants for styling
export const DEFAULT_PATH_OPTIONS: fabric.IPathOptions = {
  stroke: '#000000',
  strokeWidth: 2,
  fill: null,
  strokeLineCap: 'round',
  strokeLineJoin: 'round',
  selectable: true
};

export const DEFAULT_POLYLINE_OPTIONS: fabric.IPolylineOptions = {
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
