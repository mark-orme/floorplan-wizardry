
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Extends the Fabric.js Canvas type with additional properties
 */
export type FabricCanvasExtended = FabricCanvas & {
  [key: string]: any;
};

/**
 * Alias for Fabric.js Canvas
 */
export type FabricCanvas = FabricCanvas;

/**
 * Alias for Fabric.js Object
 */
export type FabricObjectExtended = FabricObject & {
  objectType?: string;
  id?: string;
  [key: string]: any;
};

/**
 * Event callback type for Canvas events
 */
export type TEventCallback<T = any> = (e: T) => void;

/**
 * Canvas events registry object
 */
export interface EventRegistryObject<T> {
  [key: string]: TEventCallback;
}

/**
 * Canvas events interface
 */
export interface CanvasEvents {
  [key: string]: any;
  'mouse:down': any;
  'mouse:move': any;
  'mouse:up': any;
  'selection:created': any;
  'selection:updated': any;
  'selection:cleared': any;
  'object:added': any;
  'object:removed': any;
}

// Extend fabric.js Object to include id property
declare module 'fabric' {
  interface Object {
    id?: string;
  }
}
