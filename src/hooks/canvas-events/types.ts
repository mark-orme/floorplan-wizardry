
/**
 * Canvas event handling type definitions
 * @module canvas-events/types
 */
import { Canvas as FabricCanvas } from "fabric";

/**
 * Canvas operation types
 */
export type CanvasOperation = 'draw' | 'erase' | 'select' | 'move' | 'zoom' | 'measure' | 'text';

/**
 * Canvas events map
 */
export interface CanvasEvents {
  'object:added': any;
  'object:removed': any;
  'object:modified': any;
  'object:selected': any;
  'selection:cleared': any;
  'mouse:down': any;
  'mouse:move': any;
  'mouse:up': any;
  'path:created': any;
  'zoom:updated': any;
}

/**
 * Zoom direction type
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom level constants
 */
export const ZOOM_LEVEL_CONSTANTS = {
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  
  /** Maximum zoom level */
  MAX_ZOOM: 10.0,
  
  /** Default zoom level */
  DEFAULT_ZOOM: 1.0,
  
  /** Zoom increment */
  ZOOM_INCREMENT: 0.1
};

/**
 * Handler types for canvas event systems
 */
export type EventHandlerMap = {
  [K in keyof CanvasEvents]: (e: CanvasEvents[K], canvas: FabricCanvas) => void;
};
