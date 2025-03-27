
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
  /** Unique identifier for the object */
  id?: ObjectId;
  /** Whether the object can be selected */
  selectable?: boolean;
  /** Whether the object receives events */
  evented?: boolean;
  /** Whether to use object caching */
  objectCaching?: boolean;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Fill color */
  fill?: string;
  /** Opacity (0-1) */
  opacity?: number;
  /** Size of control corners */
  cornerSize?: number;
  /** Color of control corners */
  cornerColor?: string;
  /** Stroke color for corners */
  cornerStrokeColor?: string;
  /** Whether corners are transparent */
  transparentCorners?: boolean;
  /** Whether the object has controls */
  hasControls?: boolean;
  /** Whether the object has borders */
  hasBorders?: boolean;
  /** Whether to lock horizontal movement */
  lockMovementX?: boolean;
  /** Whether to lock vertical movement */
  lockMovementY?: boolean;
  /** Type-safe indexed signature for additional properties */
  [key: string]: unknown;
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
  /** Small grid lines */
  SMALL = 'small',
  /** Large grid lines */
  LARGE = 'large',
  /** Axis lines */
  AXIS = 'axis',
  /** Grid markers */
  MARKER = 'marker'
}

/**
 * Type-safe grid line configuration
 */
export interface GridLineConfig {
  /** Type of grid line */
  type: GridLineType;
  /** Stroke color */
  stroke: string;
  /** Stroke width */
  strokeWidth: number;
  /** Optional stroke dash pattern */
  strokeDashArray?: number[];
  /** Optional opacity (0-1) */
  opacity?: number;
  /** Whether the line can be selected */
  selectable: boolean;
  /** Whether the line receives events */
  evented: boolean;
}
