
/**
 * Type definitions for Fabric.js objects
 * Provides type-safe interfaces for working with Fabric.js
 * @module types/fabricTypes
 */

/**
 * Type for object IDs in Fabric.js
 * Using string | number allows for both numeric and string-based IDs
 */
export type ObjectId = string | number;

/**
 * Strongly-typed interface for Fabric object options
 */
export interface FabricObjectOptions {
  id?: ObjectId;
  selectable?: boolean;
  evented?: boolean;
  objectCaching?: boolean;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  cornerSize?: number;
  cornerColor?: string;
  cornerStrokeColor?: string;
  transparentCorners?: boolean;
  hasControls?: boolean;
  hasBorders?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  [key: string]: any; // Allow additional properties
}

/**
 * Type guard to check if a value is a valid object ID
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a valid object ID
 */
export function isValidObjectId(value: unknown): value is ObjectId {
  return (
    typeof value === 'string' || 
    (typeof value === 'number' && !isNaN(value))
  );
}

/**
 * Safe object ID generator to ensure unique IDs
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} A unique object ID
 */
export function generateSafeObjectId(prefix: string = 'obj'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Enum for standard grid line types
 * Provides type safety for grid line classification
 */
export enum GridLineType {
  SMALL = 'small',
  LARGE = 'large',
  AXIS = 'axis',
  MARKER = 'marker'
}

/**
 * Type-safe grid line configuration
 */
export interface GridLineConfig {
  type: GridLineType;
  stroke: string;
  strokeWidth: number;
  strokeDashArray?: number[];
  opacity?: number;
  selectable: boolean;
  evented: boolean;
}
