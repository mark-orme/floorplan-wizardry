
/**
 * Canvas Types
 * Core type definitions for canvas functionality
 * @module types/canvas/canvasTypes
 */
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Canvas size
 */
export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * Canvas viewpoint
 */
export interface CanvasViewpoint {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Canvas history item
 */
export interface CanvasHistoryItem {
  id: string;
  timestamp: number;
  state: string;
  snapshot?: string;
  description?: string;
}

/**
 * Canvas history
 */
export interface CanvasHistory {
  items: CanvasHistoryItem[];
  currentIndex: number;
}

/**
 * Canvas state
 */
export interface CanvasState {
  objects: FabricObject[];
  background: string;
  viewpoint: CanvasViewpoint;
  size: CanvasSize;
}

/**
 * Canvas selection
 */
export interface CanvasSelection {
  objects: FabricObject[];
  active?: FabricObject;
}

/**
 * Type guard to check if an object is a Fabric canvas
 * @param obj Object to check
 * @returns Whether object is a Fabric canvas
 */
export function isFabricCanvas(obj: any): obj is Canvas {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.add === 'function' &&
    typeof obj.remove === 'function' &&
    typeof obj.renderAll === 'function'
  );
}
