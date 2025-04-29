
import { Canvas, Object as FabricObject, ICanvasOptions } from 'fabric';
import type { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';
import type { ExtendedFabricObject } from '@/types/canvas-types';

/**
 * Helper function to cast a canvas to ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: Canvas | ExtendedFabricCanvas | null): ExtendedFabricCanvas | null {
  if (!canvas) return null;
  
  // Cast to extended canvas type
  return canvas as ExtendedFabricCanvas;
}

/**
 * Helper function to cast an object to ExtendedFabricObject
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}
