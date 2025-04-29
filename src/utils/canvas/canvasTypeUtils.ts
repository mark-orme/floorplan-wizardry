
import { Canvas, Object as FabricObject, ICanvasOptions } from 'fabric';
import type { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';
import type { ExtendedFabricObject } from '@/types/canvas-types';

/**
 * Helper function to cast a canvas to ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: Canvas | ExtendedFabricCanvas | null): ExtendedFabricCanvas | null {
  if (!canvas) return null;
  
  // Add required properties if they don't exist
  const extCanvas = canvas as ExtendedFabricCanvas;
  
  // Ensure initialize method has the correct signature
  if (!extCanvas.initialize) {
    extCanvas.initialize = (element: string | HTMLCanvasElement, options?: ICanvasOptions): Canvas => {
      return canvas;
    };
  }
  
  return extCanvas;
}

/**
 * Helper function to cast an object to ExtendedFabricObject
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}

/**
 * Helper function to safely access extended canvas properties
 * @param canvas The canvas to access properties from
 * @param property The property to access
 * @param defaultValue The default value to return if property doesn't exist
 */
export function getExtendedCanvasProperty<T>(canvas: Canvas | ExtendedFabricCanvas | null, property: keyof ExtendedFabricCanvas, defaultValue: T): T {
  if (!canvas) return defaultValue;
  
  const extCanvas = canvas as ExtendedFabricCanvas;
  return (extCanvas[property] as unknown as T) ?? defaultValue;
}

/**
 * Helper function to safely set extended canvas properties
 */
export function setExtendedCanvasProperty(
  canvas: Canvas | ExtendedFabricCanvas | null, 
  property: keyof ExtendedFabricCanvas, 
  value: any
): void {
  if (!canvas) return;
  
  const extCanvas = canvas as ExtendedFabricCanvas;
  (extCanvas[property] as any) = value;
}

/**
 * Helper function to safely access object properties
 */
export function getExtendedObjectProperty<T>(obj: FabricObject | null, property: keyof ExtendedFabricObject, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  const extObj = obj as unknown as ExtendedFabricObject;
  return (extObj[property] as unknown as T) ?? defaultValue;
}
