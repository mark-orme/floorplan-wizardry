
/**
 * Unified Fabric.js type definitions and helpers
 * This file provides a consistent interface for Fabric.js types
 * and helps prevent type errors when working with Fabric objects
 */
import { Canvas, Object as FabricObject, Point, Circle, Rect, Line } from 'fabric';

// Re-export fabric types for consistency
export {
  Canvas,
  FabricObject,
  Point,
  Circle,
  Rect,
  Line
};

// Type definitions for common Fabric shapes
export interface FabricPoint {
  x: number;
  y: number;
}

export interface FabricCoord {
  left: number;
  top: number;
}

export interface FabricDimension {
  width: number;
  height: number;
}

export interface FabricObjectOptions {
  id?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  angle?: number;
  selectable?: boolean;
  evented?: boolean;
  visible?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  objectCaching?: boolean;
}

/**
 * Convert a plain {x, y} object to a Fabric Point
 * @param point Plain point object
 * @returns Fabric Point instance
 */
export function toFabricPoint(point: FabricPoint): Point {
  return new Point(point.x, point.y);
}

/**
 * Convert a Fabric Point to a plain {x, y} object
 * @param point Fabric Point instance
 * @returns Plain point object
 */
export function fromFabricPoint(point: Point): FabricPoint {
  return { x: point.x, y: point.y };
}

/**
 * Type guard to check if an object is a Fabric Object
 * @param obj Object to check
 * @returns Whether the object is a FabricObject
 */
export function isFabricObject(obj: any): obj is FabricObject {
  return obj && obj.type !== undefined && typeof obj.toObject === 'function';
}

/**
 * Safely add an object to a canvas
 * @param canvas Fabric canvas
 * @param obj Fabric object
 * @returns Whether the object was added successfully
 */
export function safeAddToCanvas(canvas: Canvas | null, obj: FabricObject | null): boolean {
  if (!canvas || !obj) return false;
  
  try {
    canvas.add(obj);
    canvas.renderAll();
    return true;
  } catch (error) {
    console.error('Error adding object to canvas:', error);
    return false;
  }
}

/**
 * Safely dispose of a canvas
 * @param canvas Fabric canvas to dispose
 */
export function safeDisposeCanvas(canvas: Canvas | null): void {
  if (!canvas) return;
  
  try {
    canvas.dispose();
  } catch (error) {
    console.error('Error disposing canvas:', error);
  }
}

/**
 * Extended Fabric Canvas with additional properties
 */
export interface ExtendedFabricCanvas extends Canvas {
  skipOffscreen?: boolean;
}

/**
 * Helper to safely set properties on Fabric objects
 * @param obj Fabric object
 * @param props Properties to set
 * @returns The updated object
 */
export function setFabricObjectProperties<T extends FabricObject>(
  obj: T | null,
  props: FabricObjectOptions
): T | null {
  if (!obj) return null;
  
  try {
    obj.set(props);
    return obj;
  } catch (error) {
    console.error('Error setting object properties:', error);
    return obj;
  }
}
