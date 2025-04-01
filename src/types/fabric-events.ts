
/**
 * Fabric.js event type definitions
 * Provides consistent event naming for Fabric.js event handling
 * 
 * @module types/fabric-events
 */
import { Object as FabricObject } from "fabric";

/**
 * Enum for Fabric.js event types
 * Provides consistent event naming across the application
 * 
 * @enum {string}
 */
export enum FabricEventTypes {
  /** Mouse down event - triggered when mouse button is pressed */
  MOUSE_DOWN = 'mouse:down',
  /** Mouse move event - triggered when mouse is moved */
  MOUSE_MOVE = 'mouse:move',
  /** Mouse up event - triggered when mouse button is released */
  MOUSE_UP = 'mouse:up',
  /** Mouse wheel event - triggered when mouse wheel is scrolled */
  MOUSE_WHEEL = 'mouse:wheel',
  /** Mouse over event - triggered when mouse enters an object */
  MOUSE_OVER = 'mouse:over',
  /** Mouse out event - triggered when mouse leaves an object */
  MOUSE_OUT = 'mouse:out',
  /** Mouse double click event */
  MOUSE_DBLCLICK = 'mouse:dblclick',
  
  /** Object added to canvas */
  OBJECT_ADDED = 'object:added',
  /** Object removed from canvas */
  OBJECT_REMOVED = 'object:removed',
  /** Object modified (moved, scaled, rotated, etc.) */
  OBJECT_MODIFIED = 'object:modified',
  /** Object scaling */
  OBJECT_SCALING = 'object:scaling',
  /** Object moving */
  OBJECT_MOVING = 'object:moving',
  /** Object rotation */
  OBJECT_ROTATING = 'object:rotating',
  /** Object selected */
  OBJECT_SELECTED = 'object:selected',
  /** Selection created (can include multiple objects) */
  SELECTION_CREATED = 'selection:created',
  /** Selection updated */
  SELECTION_UPDATED = 'selection:updated',
  /** Selection cleared */
  SELECTION_CLEARED = 'selection:cleared',
  
  /** Before canvas render */
  BEFORE_RENDER = 'before:render',
  /** After canvas render */
  AFTER_RENDER = 'after:render',
  /** Canvas cleared */
  CANVAS_CLEARED = 'canvas:cleared',
  
  /** Path created (during drawing) */
  PATH_CREATED = 'path:created',
  
  /** Event for custom extended functionality */
  GRID_CREATED = 'grid:created',
  /** Event for custom extended functionality */
  ZOOM_CHANGED = 'zoom:changed'
}

/**
 * Fabric.js pointer event interface
 * Standardized pointer event structure for Fabric.js
 * @interface
 */
export interface FabricPointerEvent {
  /** Original DOM event (MouseEvent or TouchEvent) */
  e: MouseEvent | TouchEvent;
  /** Canvas pointer coordinates */
  pointer?: { x: number; y: number };
  /** Object being targeted */
  target?: FabricObject;
  /** Absolute pointer coordinates */
  absolutePointer?: { x: number; y: number };
  /** Transformation matrix */
  transform?: { 
    corner?: string;
    original?: any; // Using any to avoid conflicts with Fabric's definition
    originX?: string;
    originY?: string;
    width?: number;
  };
  /** Whether it's a click vs. a drag */
  isClick?: boolean;
  /** List of currently targeted sub-objects (for groups) */
  currentSubTargets?: FabricObject[];
  /** Button number for mouse events */
  button?: number;
}

/**
 * Fabric.js event option types
 * Provides types for event options
 * 
 * @interface FabricEventOptions
 */
export interface FabricEventOptions {
  /** Whether to prevent the default action */
  preventDefault?: boolean;
  /** Whether to stop event propagation */
  stopPropagation?: boolean;
  /** Event target override */
  target?: any;
}

