
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

/**
 * Enhanced event handling utilities to handle different event handler signatures
 */
export function addCanvasEvent(canvas: fabric.Canvas, eventName: string, handler: Function) {
  if (!canvas) return;
  canvas.on(eventName, handler as any);
}

export function removeCanvasEvent(canvas: fabric.Canvas, eventName: string, handler?: Function) {
  if (!canvas) return;
  if (handler) {
    canvas.off(eventName, handler as any);
  } else {
    // Some fabric versions just need the event name to remove all handlers
    (canvas as any).off(eventName);
  }
}

// Default stroke and fill styles for consistency
export const DEFAULT_STYLES = {
  stroke: {
    color: '#000000',
    width: 2,
    dashArray: [],
    lineCap: 'round' as const,
    lineJoin: 'round' as const
  },
  fill: {
    color: 'transparent',
    opacity: 1
  }
};

// Grid constants
export const GRID_CONSTANTS = {
  PIXELS_PER_METER: 100,
  DEFAULT_GRID_SIZE: 20,
  DEFAULT_GRID_COLOR: '#cccccc',
  DEFAULT_GRID_OPACITY: 0.5
};
