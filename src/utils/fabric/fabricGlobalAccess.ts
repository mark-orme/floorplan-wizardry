
/**
 * Fabric.js Global Access Utility
 * Provides access to the global fabric namespace for components
 * that need to use it directly, while maintaining proper typing
 */
import { Canvas, Object as FabricObject, Point, Path, Polyline } from 'fabric';

// Create a type for the global fabric namespace
interface FabricGlobal {
  Canvas: typeof Canvas;
  Object: typeof FabricObject;
  Point: typeof Point;
  Path: typeof Path;
  Polyline: typeof Polyline;
  Line: any;
  Rect: any;
  Circle: any;
  Group: any;
  Text: any;
  IText: any;
  Textbox: any;
  [key: string]: any;
}

/**
 * Get the global fabric namespace safely
 * @returns The fabric namespace or null if not available
 */
export function getFabric(): FabricGlobal | null {
  if (typeof window !== 'undefined' && window.fabric) {
    return window.fabric as FabricGlobal;
  }
  return null;
}

/**
 * Create a fabric object using the global namespace
 * @param type The type of object to create
 * @param args Arguments to pass to the constructor
 * @returns The created object or null if creation failed
 */
export function createFabricObject<T = any>(
  type: string,
  ...args: any[]
): T | null {
  const fabric = getFabric();
  if (!fabric || !(type in fabric)) {
    console.error(`Fabric.js ${type} constructor not available`);
    return null;
  }
  
  try {
    const Constructor = fabric[type];
    return new Constructor(...args) as T;
  } catch (error) {
    console.error(`Error creating Fabric.js ${type}:`, error);
    return null;
  }
}

// Named factory functions for commonly used objects
export function createPath(path: string | any[], options: any = {}) {
  return createFabricObject('Path', path, options);
}

export function createLine(points: number[], options: any = {}) {
  return createFabricObject('Line', points, options);
}

export function createRect(options: any = {}) {
  return createFabricObject('Rect', options);
}

export function createCircle(options: any = {}) {
  return createFabricObject('Circle', options);
}

export function createPolyline(points: any[], options: any = {}) {
  return createFabricObject('Polyline', points, options);
}

export function createCanvas(element: string | HTMLCanvasElement, options: any = {}) {
  return createFabricObject('Canvas', element, options);
}

// Helper for dangerous but necessary UMD global access
export function withFabricGlobal<T>(callback: (fabric: FabricGlobal) => T, fallback: T): T {
  const fabric = getFabric();
  if (fabric) {
    return callback(fabric);
  }
  return fallback;
}
