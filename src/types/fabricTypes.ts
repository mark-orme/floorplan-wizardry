
/**
 * Type definitions for Fabric.js objects
 * @module types/fabricTypes
 */
import { Canvas, Object as FabricObjectBase, Point as FabricPoint } from "fabric";

// Export the Fabric Canvas and Object types
export type FabricCanvas = Canvas;
export type FabricObject = FabricObjectBase;
export type FabricPointType = FabricPoint;

// Object ID type for fabric objects
export type ObjectId = string;

/**
 * Validates if a string is a valid object ID
 * @param id The ID to validate
 * @returns True if the ID is valid
 */
export function isValidObjectId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

// Grid line type enum for differentiating grid lines
export enum GridLineType {
  SMALL = 'small',
  LARGE = 'large',
  AXIS = 'axis'
}

// Extended fabric object with common properties used in our app
export interface ExtendedFabricObject extends FabricObject {
  objectType?: string;
  id?: string;
  points?: Array<{x: number, y: number}>;
  path?: Array<any>;
  isGrid?: boolean;
  gridType?: 'small' | 'large' | 'axis';
  unitSize?: number;
  lineColor?: string;
}

/**
 * Enhanced interface for polyline objects
 */
export interface PolylineObject extends ExtendedFabricObject {
  points: Array<{x: number, y: number}>;
  type: 'polyline' | 'polygon' | 'line';
}

/**
 * Enhanced interface for path objects
 */
export interface PathObject extends ExtendedFabricObject {
  path: Array<any>;
  type: 'path';
}

/**
 * Union type for common drawing objects
 */
export type DrawingObject = PolylineObject | PathObject;

/**
 * Type guard to check if an object is a polyline
 * @param obj Object to check
 * @returns True if object is a polyline
 */
export function isPolylineObject(obj: FabricObject): obj is PolylineObject {
  return 'points' in obj && Array.isArray((obj as any).points);
}

/**
 * Type guard to check if an object is a path
 * @param obj Object to check
 * @returns True if object is a path
 */
export function isPathObject(obj: FabricObject): obj is PathObject {
  return 'path' in obj && Array.isArray((obj as any).path);
}

/**
 * Type guard to check if an object is a grid object
 * @param obj Object to check
 * @returns True if object is a grid element
 */
export function isGridObject(obj: FabricObject): boolean {
  return 'isGrid' in obj && (obj as any).isGrid === true;
}
