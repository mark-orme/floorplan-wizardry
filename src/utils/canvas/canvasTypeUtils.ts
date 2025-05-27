
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';

/**
 * Convert a Fabric Canvas to an Extended Canvas
 */
export function asExtendedCanvas(canvas: FabricCanvas): ExtendedFabricCanvas {
  const extendedCanvas = canvas as any;
  
  // Ensure required properties are defined
  if (extendedCanvas.renderOnAddRemove === undefined) {
    extendedCanvas.renderOnAddRemove = true;
  }
  
  if (!extendedCanvas.viewportTransform) {
    extendedCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  }
  
  if (extendedCanvas.skipTargetFind === undefined) {
    extendedCanvas.skipTargetFind = false;
  }
  
  if (extendedCanvas.allowTouchScrolling === undefined) {
    extendedCanvas.allowTouchScrolling = false;
  }
  
  if (extendedCanvas.skipOffscreen === undefined) {
    extendedCanvas.skipOffscreen = false;
  }
  
  return extendedCanvas as ExtendedFabricCanvas;
}

/**
 * Type guard to check if an object is a Fabric Canvas
 */
export function isFabricCanvas(obj: any): obj is FabricCanvas {
  return obj && 
         typeof obj.renderAll === 'function' &&
         typeof obj.getWidth === 'function' &&
         typeof obj.getHeight === 'function';
}
