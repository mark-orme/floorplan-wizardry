
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas, ExtendedFabricObject } from '@/types/canvas-types';

/**
 * Helper function to cast a canvas to ExtendedFabricCanvas
 * @param canvas The canvas to cast
 * @returns The canvas as ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: Canvas | null): ExtendedFabricCanvas | null {
  if (!canvas) return null;
  return canvas as ExtendedFabricCanvas;
}

/**
 * Helper function to cast an object to ExtendedFabricObject
 * @param obj The object to cast
 * @returns The object as ExtendedFabricObject
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}
