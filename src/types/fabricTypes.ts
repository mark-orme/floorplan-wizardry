
/**
 * Type definitions for fabric.js
 * @module fabricTypes
 */
import { Canvas, Object } from 'fabric';

// Export canvas type for fabric
export type FabricCanvas = Canvas;

// Export object type for fabric
export type FabricObject = Object;

// Export Point type for fabric
export interface FabricPoint {
  x: number;
  y: number;
}

/**
 * Fabric object with object type metadata
 */
export interface TypedFabricObject extends Object {
  objectType?: string;
}

/**
 * Drawing path options
 */
export interface PathOptions {
  stroke: string;
  strokeWidth: number;
  fill?: string;
  selectable?: boolean;
  objectCaching?: boolean;
  perPixelTargetFind?: boolean;
  strokeLineCap?: 'butt' | 'round' | 'square';
  strokeLineJoin?: 'bevel' | 'round' | 'miter';
  strokeDashArray?: number[];
  opacity?: number;
  objectType?: string;
  hasBorders?: boolean;
  hasControls?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  hoverCursor?: string;
  data?: any;
}

/**
 * Line options
 */
export interface LineOptions extends PathOptions {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Rectangle options
 */
export interface RectOptions extends PathOptions {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Circle options
 */
export interface CircleOptions extends PathOptions {
  left: number;
  top: number;
  radius: number;
}
