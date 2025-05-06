
import { Object as FabricObject, IObjectOptions, IPathOptions, Canvas } from 'fabric';
import { Point } from 'fabric/fabric-impl';

/**
 * Extended Fabric interface for proper TypeScript support
 */
export interface IExtendedObjectOptions extends IObjectOptions {
  objectType?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
}

/**
 * Extended Fabric path options
 */
export interface IPathOptions extends IObjectOptions {
  path?: string | { x: number; y: number }[];
}

/**
 * Convert simple points to Fabric.js Points
 * @param points Array of simple {x,y} points
 * @returns Array of Fabric.js Points
 */
export function toFabricPoints(points: Array<{ x: number; y: number }>): Point[] {
  if (!points || !Array.isArray(points)) return [];
  
  // Import fabric dynamically when in browser environment
  if (typeof window !== 'undefined' && window.fabric) {
    return points.map(p => new window.fabric.Point(p.x, p.y));
  }
  
  // Fallback if fabric is not available
  return points as unknown as Point[];
}

/**
 * Implementation of Fabric objects that match the required interfaces
 */
export class ExtendedFabricObject implements FabricObject {
  id?: string;
  objectType?: string;
  visible = true;
  selectable = true;
  evented = true;
  type = 'object';
  
  // Required implementations
  initialize(options?: IObjectOptions) {
    if (options) {
      Object.assign(this, options);
    }
    return this;
  }
  
  setOptions(options: IObjectOptions) {
    Object.assign(this, options);
    return this;
  }
  
  set(key: string | Record<string, any>, value?: any) {
    if (typeof key === 'object') {
      Object.assign(this, key);
    } else if (typeof key === 'string' && value !== undefined) {
      (this as any)[key] = value;
    }
    return this;
  }
  
  // Minimal required implementation
  setCoords() {
    return this;
  }
  
  // Add any other required methods from FabricObject interface
  // that your application uses
}

/**
 * Create a Fabric.js path safely with proper typing
 */
export function createPath(pathData: string | Array<{ x: number; y: number }>, options: IPathOptions = {}) {
  if (typeof window === 'undefined' || !window.fabric) {
    console.warn('Fabric.js not available in this environment');
    return null;
  }
  
  try {
    // Convert simple points to path data if needed
    let finalPathData: string | Point[];
    if (Array.isArray(pathData) && pathData.length > 0 && 'x' in pathData[0] && 'y' in pathData[0]) {
      finalPathData = toFabricPoints(pathData);
    } else {
      finalPathData = pathData as string;
    }
    
    return new window.fabric.Path(finalPathData, options);
  } catch (error) {
    console.error('Error creating fabric Path:', error);
    return null;
  }
}

/**
 * Create a Fabric.js group safely with proper typing
 */
export function createGroup(objects: FabricObject[], options: IObjectOptions = {}) {
  if (typeof window === 'undefined' || !window.fabric) {
    console.warn('Fabric.js not available in this environment');
    return null;
  }
  
  try {
    // Make sure we have a valid array of objects
    const validObjects = Array.isArray(objects) ? objects : [];
    return new window.fabric.Group(validObjects, options);
  } catch (error) {
    console.error('Error creating fabric Group:', error);
    return null;
  }
}

/**
 * Create a Fabric.js polyline safely with proper typing
 */
export function createPolyline(points: Array<{ x: number; y: number }>, options: IObjectOptions = {}) {
  if (typeof window === 'undefined' || !window.fabric) {
    console.warn('Fabric.js not available in this environment');
    return null;
  }
  
  try {
    const fabricPoints = toFabricPoints(points);
    return new window.fabric.Polyline(fabricPoints, options);
  } catch (error) {
    console.error('Error creating fabric Polyline:', error);
    return null;
  }
}

/**
 * Safely create a Fabric canvas with error handling
 */
export function createCanvas(element: HTMLCanvasElement | string, options: any = {}): Canvas | null {
  if (typeof window === 'undefined' || !window.fabric) {
    console.warn('Fabric.js not available in this environment');
    return null;
  }
  
  try {
    return new window.fabric.Canvas(element, options);
  } catch (error) {
    console.error('Error creating fabric Canvas:', error);
    return null;
  }
}
