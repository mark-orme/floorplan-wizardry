
/**
 * Fabric.js type definitions
 * @module types/fabric
 */

import { Object as FabricObject, Point } from 'fabric';
import type { Point as AppPoint } from './floorPlanTypes';

// Export AppPoint type for compatibility with our application Point interface
export type { AppPoint };

/**
 * Options used when creating a Fabric.js canvas
 * @interface CanvasCreationOptions
 */
export interface CanvasCreationOptions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
  /** Canvas background color (optional) */
  backgroundColor?: string;
  /** Additional options supported by Fabric.js canvas */
  [key: string]: unknown;
}

/**
 * Canvas and related objects references
 * @interface CanvasReferences
 */
export interface CanvasReferences {
  /** Reference to the Fabric canvas instance */
  canvas: any;
  /** Reference to the canvas DOM element */
  canvasElement: HTMLCanvasElement;
  /** Reference to the container DOM element */
  container: HTMLElement;
}

/**
 * Grid dimensions configuration
 * @interface GridDimensions
 */
export interface GridDimensions {
  /** Width of the grid in pixels */
  width: number;
  /** Height of the grid in pixels */
  height: number;
  /** Grid cell size in pixels */
  cellSize: number;
}

/**
 * Result from grid rendering operations
 * @interface GridRenderResult
 */
export interface GridRenderResult {
  /** All grid-related objects */
  gridObjects: any[];
  /** Small grid lines */
  smallGridLines: any[];
  /** Large grid lines */
  largeGridLines: any[];
  /** Grid markers (labels) */
  markers: any[];
}

/**
 * Custom touch event extended from TouchEvent
 * @interface CustomTouchEvent
 */
export interface CustomTouchEvent extends TouchEvent {
  /** TouchList containing active touches */
  touches: TouchList;
  /** TouchList containing touches that changed in this event */
  changedTouches: TouchList;
  /** TouchList containing touches that started on the target element */
  targetTouches: TouchList;
}

/**
 * Fabric-specific touch event structure for multi-touch handling
 * @interface CustomFabricTouchEvent
 */
export interface CustomFabricTouchEvent {
  /** Array of touch points with coordinates */
  touches: {
    /** X coordinate of the touch point */
    x: number;
    /** Y coordinate of the touch point */
    y: number;
  }[];
  /** Original Touch or Event object */
  e: Touch | Event;
}

/**
 * Extended Fabric pointer event type for compatibility with Fabric.js v6
 * @interface FabricPointerEvent
 */
export interface FabricPointerEvent {
  /** Original browser event */
  e: MouseEvent | TouchEvent;
  /** Pointer position */
  pointer: Point;
  /** Absolute pointer position */
  absolutePointer: Point;
  /** Scene point */
  scenePoint: Point;
  /** Viewport point */
  viewportPoint: Point;
  /** Target object */
  target?: FabricObject | null;
  /** Sub-targets */
  subTargets?: FabricObject[];
  /** Whether this is a click event - required by Fabric.js v6 */
  isClick: boolean;  
  /** Current sub-targets - required by Fabric.js v6 */
  currentSubTargets: FabricObject[];  
}
