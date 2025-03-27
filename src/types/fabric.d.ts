
/**
 * Fabric.js related type definitions
 * @module types/fabric
 */

import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Canvas creation options for Fabric.js
 * @interface CanvasCreationOptions
 */
export interface CanvasCreationOptions {
  /** Canvas width in pixels */
  width: number;
  
  /** Canvas height in pixels */
  height: number;
  
  /** Background color of the canvas */
  backgroundColor?: string;
  
  /** Whether to enable retina scaling */
  enableRetinaScaling?: boolean;
  
  /** Whether to stop context menu on right click */
  stopContextMenu?: boolean;
  
  /** Whether to fire right click events */
  fireRightClick?: boolean;
  
  /** Whether to render on add/remove operations */
  renderOnAddRemove?: boolean;
  
  /** Whether to enable pointer events */
  enablePointerEvents?: boolean;
  
  /** Whether to skip target finding */
  skipTargetFind?: boolean;
  
  /** Whether to enable per-pixel target finding */
  perPixelTargetFind?: boolean;
  
  /** Tolerance for target finding */
  targetFindTolerance?: number;
  
  /** Whether the canvas is interactive */
  interactive?: boolean;
}

/**
 * References to canvas elements and objects
 * @interface CanvasReferences
 */
export interface CanvasReferences {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

/**
 * Grid dimensions interface
 * @interface GridDimensions
 */
export interface GridDimensions {
  width: number;
  height: number;
  cellSize: number;
}

/**
 * Grid render result interface
 * @interface GridRenderResult
 */
export interface GridRenderResult {
  objects: FabricObject[];
  dimensions: GridDimensions;
  gridObjects?: FabricObject[];
  smallGridLines?: FabricObject[];
  largeGridLines?: FabricObject[];
  markers?: FabricObject[];
}

/**
 * Custom touch event interface
 * @interface CustomTouchEvent
 */
export interface CustomTouchEvent extends TouchEvent {
  touches: TouchList;
  changedTouches: TouchList;
}

/**
 * Custom fabric touch event interface
 * @interface CustomFabricTouchEvent
 */
export interface CustomFabricTouchEvent {
  touches: { x: number; y: number }[];
  e: Touch;
}
