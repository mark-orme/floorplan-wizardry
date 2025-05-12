
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * A unified canvas type to solve type compatibility issues throughout the application.
 * This provides a common baseline that all canvas references can use.
 */
export interface UnifiedCanvas extends Canvas {
  wrapperEl: HTMLElement;
  isDrawingMode: boolean;
  renderOnAddRemove: boolean;
  viewportTransform: number[];
  selection: boolean;
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
 * @param canvas The fabric Canvas to convert
 * @returns A Canvas with the guaranteed properties of UnifiedCanvas
 */
export function asUnifiedCanvas(canvas: Canvas | null): UnifiedCanvas | null {
  if (!canvas) return null;
  
  // Ensure required properties exist with defaults
  if (!canvas.viewportTransform) {
    (canvas as any).viewportTransform = [1, 0, 0, 1, 0, 0];
  }
  
  if ((canvas as any).renderOnAddRemove === undefined) {
    (canvas as any).renderOnAddRemove = true;
  }
  
  if ((canvas as any).isDrawingMode === undefined) {
    (canvas as any).isDrawingMode = false;
  }
  
  if ((canvas as any).selection === undefined) {
    (canvas as any).selection = true;
  }
  
  if ((canvas as any).freeDrawingBrush === undefined) {
    (canvas as any).freeDrawingBrush = {
      color: '#000000',
      width: 1
    };
  }
  
  return canvas as UnifiedCanvas;
}

// Create type aliases for backward compatibility
export type ExtendedCanvas = UnifiedCanvas;
export type ExtendedFabricCanvas = UnifiedCanvas;
