
/**
 * Simplified Canvas Type Unification
 * 
 * This file provides a simplified, unified canvas type that removes unnecessary complexity
 */
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * A simplified unified canvas interface that works with Fabric.js
 */
export interface UnifiedCanvas extends Canvas {
  wrapperEl: HTMLElement;
  skipTargetFind: boolean;
  renderOnAddRemove: boolean;
  viewportTransform: number[];
  isDrawingMode: boolean;
  selection: boolean;
  defaultCursor: string;
  hoverCursor: string;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
}

/**
 * Type guard to check if an object is a Canvas
 */
export function isCanvas(obj: any): obj is Canvas {
  return obj && 
         typeof obj.renderAll === 'function' &&
         typeof obj.getWidth === 'function' &&
         typeof obj.getHeight === 'function';
}

/**
 * Safely convert a Canvas to a UnifiedCanvas
 */
export function asUnifiedCanvas(canvas: Canvas | null): UnifiedCanvas | null {
  if (!canvas) return null;
  
  // Ensure required properties are defined with defaults
  if (!canvas.viewportTransform) {
    (canvas as any).viewportTransform = [1, 0, 0, 1, 0, 0];
  }
  
  if ((canvas as any).renderOnAddRemove === undefined) {
    (canvas as any).renderOnAddRemove = true;
  }
  
  if ((canvas as any).skipTargetFind === undefined) {
    (canvas as any).skipTargetFind = false;
  }
  
  if ((canvas as any).isDrawingMode === undefined) {
    (canvas as any).isDrawingMode = false;
  }
  
  if ((canvas as any).selection === undefined) {
    (canvas as any).selection = true;
  }
  
  if ((canvas as any).defaultCursor === undefined) {
    (canvas as any).defaultCursor = 'default';
  }
  
  if ((canvas as any).hoverCursor === undefined) {
    (canvas as any).hoverCursor = 'move';
  }
  
  if ((canvas as any).freeDrawingBrush === undefined) {
    (canvas as any).freeDrawingBrush = {
      color: '#000000',
      width: 1
    };
  }
  
  return canvas as UnifiedCanvas;
}

/**
 * Simple Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Export ExtendedCanvas as an alias for UnifiedCanvas for backward compatibility
 */
export type ExtendedCanvas = UnifiedCanvas;
