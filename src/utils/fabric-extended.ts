
/**
 * Extended Fabric.js utilities and types
 * Provides compatibility between different Fabric.js versions
 */
import * as fabric from 'fabric';

// Re-export standard fabric components
export * from 'fabric';

// Add extended fabric components that might be missing
export class Path extends fabric.Path {
  // Add any extended functionality here if needed
}

export class Group extends fabric.Group {
  // Add any extended functionality here if needed
}

export class Polyline extends fabric.Polyline {
  // Add any extended functionality here if needed
}

// Add type safety utilities for fabric objects
export function isPath(obj: any): obj is fabric.Path {
  return obj && obj.type === 'path';
}

export function isGroup(obj: any): obj is fabric.Group {
  return obj && obj.type === 'group';
}

export function isPolyline(obj: any): obj is fabric.Polyline {
  return obj && obj.type === 'polyline';
}

// Helper for safely getting fabric objects
export function getFabricPath(pathData: string, options: fabric.IPathOptions = {}) {
  return new fabric.Path(pathData, options);
}

export function getFabricGroup(objects: fabric.Object[], options: fabric.IGroupOptions = {}) {
  return new fabric.Group(objects, options);
}

export function getFabricPolyline(points: Array<{ x: number; y: number }>, options: fabric.IPolylineOptions = {}) {
  return new fabric.Polyline(points, options);
}
