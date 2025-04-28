
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Extended type for fabric objects
 */
export interface ExtendedFabricObject extends FabricObject {
  objectType?: string;
  id?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  stroke?: string;
  strokeWidth?: number;
  set: (options: Record<string, any>) => FabricObject;
}

/**
 * FloorPlan metadata type
 */
export interface FloorPlanMetadata {
  id: string;
  name: string;
  created: string;
  modified: string;
  size: number;
}

/**
 * Property status type
 */
export type PropertyStatus = 'active' | 'inactive' | 'pending' | 'sold' | 'archived';

/**
 * Helper functions for typecasting fabric objects
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}

export function asExtendedCanvas(canvas: Canvas): Canvas {
  return canvas;
}
