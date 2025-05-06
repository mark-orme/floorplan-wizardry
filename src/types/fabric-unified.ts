
/**
 * Unified Fabric Types
 * Provides compatibility across different Fabric.js versions
 */
import { Object as FabricObject, Canvas, IObjectOptions } from 'fabric';

// Re-export standard types
export type { Canvas, FabricObject };

// Create a unified Point type
export interface Point {
  x: number;
  y: number;
}

// Unified path options
export interface PathOptions extends IObjectOptions {
  path?: string | Point[];
  objectType?: string;
  evented?: boolean;
  selectable?: boolean;
}

// Unified line options
export interface LineOptions extends IObjectOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stroke?: string;
  strokeWidth?: number;
  evented?: boolean;
  selectable?: boolean;
  objectType?: string;
}

// Unified measurement data
export interface MeasurementData {
  distance: number;
  angle: number;
  units?: string;
  precision?: number;
  formatted?: string;
  snapped?: boolean; // Added missing property
  unit?: string; // Added missing property
}

// Unified fabric object types
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  metadata?: any;
}

// Typeguards for fabric objects
export function isPathObject(obj: any): boolean {
  return obj && obj.type === 'path';
}

export function isLineObject(obj: any): boolean {
  return obj && obj.type === 'line';
}

/**
 * Common event handler signature for Fabric.js events
 */
export type FabricEventHandler<T = any> = (e: T) => void;

/**
 * Fabric.js event types
 */
export enum FabricEventType {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  OBJECT_MODIFIED = 'object:modified',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared'
}
