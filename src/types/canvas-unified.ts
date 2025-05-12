
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
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove: boolean;
  viewportTransform: number[];
  isDrawingMode: boolean;
  selection: boolean;
  defaultCursor: string;
  hoverCursor: string;
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
 * Type converter to safely cast a Canvas to an ExtendedCanvas
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

export type { Point } from './core/Point';
