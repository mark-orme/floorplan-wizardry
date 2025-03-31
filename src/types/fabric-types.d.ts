
/**
 * Type definitions for Fabric.js integration
 * Defines proper types for Fabric.js objects and events
 * 
 * @module types/fabric-types
 */

import { Point } from '@/types/core/Geometry';

/**
 * Fabric.js Point interface
 * Represents a point in the Fabric.js coordinate system
 */
export interface FabricPoint {
  x: number;
  y: number;
}

/**
 * Options for Fabric.js Line objects
 * Defines all possible configuration options for lines
 */
export interface LineOptions {
  /** Line color */
  stroke?: string;
  /** Line width */
  strokeWidth?: number;
  /** Whether the line can be selected */
  selectable?: boolean;
  /** Line dash pattern */
  strokeDashArray?: number[];
  /** Whether the line responds to events */
  evented?: boolean;
  /** Whether the line can be modified */
  lockMovementX?: boolean;
  /** Whether the line can be modified */
  lockMovementY?: boolean;
  /** Custom type identification */
  objectType?: string;
  /** Line cap style */
  strokeLineCap?: 'butt' | 'round' | 'square';
  /** Line join style */
  strokeLineJoin?: 'miter' | 'round' | 'bevel';
  /** Whether the line is visible */
  visible?: boolean;
  /** Opacity of the line */
  opacity?: number;
}

/**
 * Touch event record
 * Standardized interface for touch events
 */
export interface TouchRecord {
  /** Unique identifier for this touch point */
  identifier: number;
  /** X coordinate relative to client viewport */
  clientX: number;
  /** Y coordinate relative to client viewport */
  clientY: number;
  /** Standardized point interface for internal usage */
  position: Point;
  /** Original browser touch event (optional) */
  originalEvent?: TouchEvent;
}

/**
 * Fabric event types
 * Defines all possible event names for Fabric.js
 */
export enum FabricEventNames {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared',
  OBJECT_ADDED = 'object:added',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_REMOVED = 'object:removed',
  AFTER_RENDER = 'after:render',
  BEFORE_RENDER = 'before:render',
  CANVAS_CLEARED = 'canvas:cleared',
  PATH_CREATED = 'path:created'
}
