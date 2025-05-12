
/**
 * Canvas Type Unification
 * 
 * This file provides unified canvas types to bridge the different
 * canvas type interfaces in the application.
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedCanvas as CanvasTypesExtendedCanvas } from './canvas-types';
import { ExtendedCanvas as FabricUnifiedExtendedCanvas } from './fabric-unified';

export interface UnifiedCanvas extends Canvas {
  wrapperEl: HTMLElement;
  skipTargetFind: boolean; // Changed from optional to required
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove: boolean;
  viewportTransform: number[]; // Ensure this is non-optional
  isDrawingMode: boolean;
  selection: boolean;
  defaultCursor: string;
  hoverCursor: string;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  getActiveObject?: () => any;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  zoomToPoint?: (point: { x: number, y: number }, value: number) => void;
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
 * Type converter to safely cast a Canvas to an UnifiedCanvas
 */
export function asUnifiedCanvas(canvas: Canvas | null): UnifiedCanvas | null {
  if (!canvas) return null;
  
  // Ensure required properties are defined
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
  
  return canvas as unknown as UnifiedCanvas;
}

/**
 * Convert between CanvasTypes.ExtendedCanvas and FabricUnified.ExtendedCanvas
 */
export function bridgeCanvasTypes<T extends Canvas>(
  canvas: T | CanvasTypesExtendedCanvas | FabricUnifiedExtendedCanvas | null
): UnifiedCanvas | null {
  return asUnifiedCanvas(canvas as Canvas);
}

// Add this missing type for Point to fix some errors
export interface Point {
  x: number;
  y: number;
}

export type { Point as FabricPoint } from './core/Point';
export type { ExtendedCanvas } from './fabric-unified';
