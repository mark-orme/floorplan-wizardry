
import { Canvas, Object as FabricObject } from 'fabric';
import { ExtendedFabricCanvas } from './ExtendedFabricCanvas';

/**
 * Extended Fabric Object interface
 */
export interface ExtendedFabricObject extends FabricObject {
  /** Type of object */
  objectType?: string;
  /** Whether the object is visible */
  visible?: boolean;
  /** Whether the object is a grid element */
  isGrid?: boolean;
  /** Whether the object is a large grid element */
  isLargeGrid?: boolean;
}

/**
 * Helper function to cast a canvas to ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: Canvas | null): ExtendedFabricCanvas | null {
  if (!canvas) return null;
  return canvas as ExtendedFabricCanvas;
}

/**
 * Helper function to cast an object to ExtendedFabricObject
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}

export type { ExtendedFabricCanvas };
